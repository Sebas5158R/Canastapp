import prisma from "../../utils/prisma.js";

const createHttpError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const parseBigIntId = (value, fieldName = "id") => {
    if (typeof value === "bigint") {
        return value;
    }

    try {
        return BigInt(value);
    } catch {
        throw createHttpError(400, `${fieldName} inválido`);
    }
};

const parseDecimalValue = (value, fieldName, { required = false } = {}) => {
    if (value === undefined || value === null || value === "") {
        if (required) {
            throw createHttpError(400, `${fieldName} es requerido`);
        }

        return undefined;
    }

    const normalized = Number(value);

    if (Number.isNaN(normalized)) {
        throw createHttpError(400, `${fieldName} debe ser numérico`);
    }

    return normalized;
};

const normalizeRecipeItem = (item, index) => {
    const ingredienteId = parseBigIntId(item?.ingrediente_id, `receta[${index}].ingrediente_id`);
    const cantidadNecesaria = parseDecimalValue(item?.cantidad_necesaria, `receta[${index}].cantidad_necesaria`, { required: true });

    if (cantidadNecesaria <= 0) {
        throw createHttpError(400, `receta[${index}].cantidad_necesaria debe ser mayor a 0`);
    }

    const unidadMedida = String(item?.unidad_medida || "").trim();

    if (!unidadMedida) {
        throw createHttpError(400, `receta[${index}].unidad_medida es requerido`);
    }

    return {
        ingrediente_id: ingredienteId,
        cantidad_necesaria: cantidadNecesaria,
        unidad_medida: unidadMedida,
    };
};

const aggregateRecipe = (receta = []) => {
    const aggregated = new Map();

    receta.forEach((item, index) => {
        const normalized = normalizeRecipeItem(item, index);
        const key = normalized.ingrediente_id.toString();
        const current = aggregated.get(key);

        if (current) {
            current.cantidad_necesaria += normalized.cantidad_necesaria;
        } else {
            aggregated.set(key, { ...normalized });
        }
    });

    return Array.from(aggregated.values());
};

const updateMateriaPrimaEstado = async (client, materiaPrimaId) => {
    const materiaPrima = await client.materia_prima.findUnique({
        where: { id: materiaPrimaId },
    });

    if (!materiaPrima) {
        throw createHttpError(404, "Materia prima no encontrada");
    }

    if (Number(materiaPrima.cantidad_disponible) <= 0 && materiaPrima.estado_inventario !== "sin_stock") {
        await client.materia_prima.update({
            where: { id: materiaPrimaId },
            data: {
                estado_inventario: "sin_stock",
                updated_at: new Date(),
            },
        });
    }
};

const buildProductoData = (data) => {
    const payload = {};

    if (data.nombre !== undefined) payload.nombre = String(data.nombre).trim();
    if (data.descripcion !== undefined) payload.descripcion = data.descripcion?.trim() || null;
    if (data.unidad_medida !== undefined) payload.unidad_medida = data.unidad_medida?.trim() || null;

    const costoEstimado = parseDecimalValue(data.costo_estimado, "costo_estimado");
    if (costoEstimado !== undefined) payload.costo_estimado = costoEstimado;

    return payload;
};

const validateRecipeStock = async (tx, receta) => {
    const ingredientIds = receta.map((item) => item.ingrediente_id);

    const materiasPrimas = await tx.materia_prima.findMany({
        where: {
            id: { in: ingredientIds },
        },
    });

    const materiasMap = new Map(materiasPrimas.map((materia) => [materia.id.toString(), materia]));

    if (materiasMap.size !== ingredientIds.length) {
        const missingId = ingredientIds.find((id) => !materiasMap.has(id.toString()));
        throw createHttpError(404, `Materia prima no encontrada: ${missingId.toString()}`);
    }

    for (const item of receta) {
        const materiaPrima = materiasMap.get(item.ingrediente_id.toString());
        const stockDisponible = Number(materiaPrima.cantidad_disponible);

        if (stockDisponible < item.cantidad_necesaria) {
            throw createHttpError(
                400,
                `Stock insuficiente para ${materiaPrima.nombre}: disponible ${stockDisponible}, requerido ${item.cantidad_necesaria}`
            );
        }
    }
};

const getProductoWithReceta = (client, id) => {
    return client.productos.findUnique({
        where: { id },
        include: {
            recetas: {
                include: {
                    materia_prima: true,
                },
                orderBy: { id: "asc" },
            },
        },
    });
};

export const getProductos = async () => {
    return prisma.productos.findMany({
        orderBy: { id: "desc" },
        include: {
            recetas: {
                include: {
                    materia_prima: true,
                },
                orderBy: { id: "asc" },
            },
        },
    });
};

export const getProductoById = async (id) => {
    const productoId = parseBigIntId(id, "producto_id");
    const producto = await getProductoWithReceta(prisma, productoId);

    if (!producto) {
        throw createHttpError(404, "Producto no encontrado");
    }

    return producto;
};

export const createProducto = async (data) => {
    if (!data?.nombre || !String(data.nombre).trim()) {
        throw createHttpError(400, "nombre es requerido");
    }

    if (!Array.isArray(data.receta) || data.receta.length === 0) {
        throw createHttpError(400, "receta es requerida y debe tener al menos un ingrediente");
    }

    const payload = buildProductoData(data);
    const receta = aggregateRecipe(data.receta);

    if (!payload.nombre) {
        throw createHttpError(400, "nombre es requerido");
    }

    const usuarioId = data.usuario_id !== undefined && data.usuario_id !== null && data.usuario_id !== ""
        ? parseBigIntId(data.usuario_id, "usuario_id")
        : null;
    const observaciones = data.observaciones !== undefined ? String(data.observaciones).trim() : null;

    return prisma.$transaction(async (tx) => {
        await validateRecipeStock(tx, receta);

        const producto = await tx.productos.create({
            data: {
                ...payload,
                nombre: payload.nombre,
                unidad_medida: payload.unidad_medida ?? "unidad",
            },
        });

        await tx.recetas.createMany({
            data: receta.map((item) => ({
                producto_id: producto.id,
                ingrediente_id: item.ingrediente_id,
                cantidad_necesaria: item.cantidad_necesaria,
                unidad_medida: item.unidad_medida,
            })),
        });

        for (const item of receta) {
            const affectedRows = await tx.materia_prima.updateMany({
                where: {
                    id: item.ingrediente_id,
                    cantidad_disponible: {
                        gte: item.cantidad_necesaria,
                    },
                },
                data: {
                    cantidad_disponible: {
                        decrement: item.cantidad_necesaria,
                    },
                    updated_at: new Date(),
                },
            });

            if (affectedRows.count === 0) {
                throw createHttpError(400, `Stock insuficiente para ingrediente ${item.ingrediente_id.toString()}`);
            }

            await updateMateriaPrimaEstado(tx, item.ingrediente_id);

            await tx.movimientos_inventario.create({
                data: {
                    materia_prima_id: item.ingrediente_id,
                    tipo_movimiento: "salida",
                    cantidad: item.cantidad_necesaria,
                    usuario_id: usuarioId,
                    orden_produccion_id: null,
                    observaciones: observaciones || `Consumo automático por creación de producto ${producto.nombre}`,
                },
            });
        }

        return getProductoWithReceta(tx, producto.id);
    });
};

export const updateProducto = async (id, data) => {
    const productoId = parseBigIntId(id, "producto_id");
    const producto = await prisma.productos.findUnique({ where: { id: productoId } });

    if (!producto) {
        throw createHttpError(404, "Producto no encontrado");
    }

    const payload = buildProductoData(data);

    if (Object.keys(payload).length === 0) {
        throw createHttpError(400, "No hay datos para actualizar");
    }

    return prisma.productos.update({
        where: { id: productoId },
        data: {
            ...payload,
            updated_at: new Date(),
        },
        include: {
            recetas: {
                include: {
                    materia_prima: true,
                },
                orderBy: { id: "asc" },
            },
        },
    });
};

export const replaceRecetaProducto = async (id, data) => {
    const productoId = parseBigIntId(id, "producto_id");
    const producto = await prisma.productos.findUnique({ where: { id: productoId } });

    if (!producto) {
        throw createHttpError(404, "Producto no encontrado");
    }

    if (!Array.isArray(data.receta) || data.receta.length === 0) {
        throw createHttpError(400, "receta es requerida y debe tener al menos un ingrediente");
    }

    const receta = aggregateRecipe(data.receta);

    return prisma.$transaction(async (tx) => {
        await validateRecipeStock(tx, receta);

        await tx.recetas.deleteMany({
            where: { producto_id: productoId },
        });

        await tx.recetas.createMany({
            data: receta.map((item) => ({
                producto_id: productoId,
                ingrediente_id: item.ingrediente_id,
                cantidad_necesaria: item.cantidad_necesaria,
                unidad_medida: item.unidad_medida,
            })),
        });

        return getProductoWithReceta(tx, productoId);
    });
};

export const deleteProducto = async (id) => {
    const productoId = parseBigIntId(id, "producto_id");
    const producto = await prisma.productos.findUnique({ where: { id: productoId } });

    if (!producto) {
        throw createHttpError(404, "Producto no encontrado");
    }

    const ordenes = await prisma.ordenes_produccion.count({
        where: { producto_id: productoId },
    });

    if (ordenes > 0) {
        throw createHttpError(400, "No se puede eliminar un producto con órdenes de producción asociadas");
    }

    await prisma.$transaction(async (tx) => {
        await tx.recetas.deleteMany({
            where: { producto_id: productoId },
        });

        await tx.productos.delete({
            where: { id: productoId },
        });
    });

    return { message: "Producto eliminado correctamente" };
};
