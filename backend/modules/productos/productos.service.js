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
// ─────────────────────────────────────────────────────────────
// NUEVOS MÉTODOS PARA ÓRDENES DE PRODUCCIÓN
// ─────────────────────────────────────────────────────────────

export const getRecetaByProducto = async (id) => {
  const productoId = parseBigIntId(id, "producto_id");
  
  const producto = await getProductoWithReceta(prisma, productoId);
  
  if (!producto) {
    throw createHttpError(404, "Producto no encontrado");
  }
  
  // Transformar la respuesta para el frontend
  return {
    producto_id: Number(producto.id),
    producto_nombre: producto.nombre,
    ingredientes: producto.recetas.map(receta => ({
      materia_prima_id: Number(receta.ingrediente_id),
      nombre: receta.materia_prima.nombre,
      cantidad_necesaria: Number(receta.cantidad_necesaria),
      unidad_medida: receta.unidad_medida,
      stock_disponible: Number(receta.materia_prima.cantidad_disponible)
    }))
  };
};

export const validarStockProducto = async (id, cantidad_solicitada) => {
  const productoId = parseBigIntId(id, "producto_id");
  const cantidad = parseInt(cantidad_solicitada, 10);
  
  if (!cantidad || cantidad <= 0) {
    throw createHttpError(400, "cantidad_solicitada debe ser un entero positivo");
  }
  
  const producto = await getProductoWithReceta(prisma, productoId);
  
  if (!producto) {
    throw createHttpError(404, "Producto no encontrado");
  }
  
  if (producto.recetas.length === 0) {
    throw createHttpError(400, "El producto no tiene una receta definida");
  }
  
  const faltantes = [];
  let stockValido = true;
  
  for (const receta of producto.recetas) {
    const requerido = Number(receta.cantidad_necesaria) * cantidad;
    const disponible = Number(receta.materia_prima.cantidad_disponible);
    
    if (disponible < requerido) {
      stockValido = false;
      faltantes.push({
        materia_prima_id: Number(receta.ingrediente_id),
        nombre: receta.materia_prima.nombre,
        disponible: disponible,
        requerido: requerido,
        faltante: requerido - disponible,
        unidad_medida: receta.unidad_medida
      });
    }
  }
  
  return {
    valida: stockValido,
    faltantes: faltantes,
    mensaje: stockValido 
      ? 'Stock suficiente para producir la cantidad solicitada' 
      : 'Stock insuficiente para algunas materias primas'
  };
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

const validateRecipeIngredients = async (tx, receta) => {
    const ingredientIds = receta.map((item) => item.ingrediente_id);

    const materiasPrimas = await tx.materia_prima.findMany({
        where: { id: { in: ingredientIds } },
        select: { id: true, nombre: true },
    });

    if (materiasPrimas.length !== ingredientIds.length) {
        const foundIds = new Set(materiasPrimas.map((m) => m.id.toString()));
        const missingId = ingredientIds.find((id) => !foundIds.has(id.toString()));
        throw createHttpError(404, `Materia prima no encontrada: ${missingId.toString()}`);
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

    return prisma.$transaction(async (tx) => {
        await validateRecipeIngredients(tx, receta);

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
        await validateRecipeIngredients(tx, receta);

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