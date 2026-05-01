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

const parseDecimalValue = (value, fieldName) => {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }

    const normalized = Number(value);
    if (Number.isNaN(normalized)) {
        throw createHttpError(400, `${fieldName} debe ser numérico`);
    }

    return normalized;
};

const buildMateriaPrimaData = (data) => {
    const payload = {};

    if (data.nombre !== undefined) payload.nombre = String(data.nombre).trim();
    if (data.descripcion !== undefined) payload.descripcion = data.descripcion?.trim() || null;
    if (data.unidad_medida !== undefined) payload.unidad_medida = data.unidad_medida?.trim() || null;
    if (data.estado_inventario !== undefined) payload.estado_inventario = data.estado_inventario?.trim() || null;

    const cantidadDisponible = parseDecimalValue(data.cantidad_disponible, "cantidad_disponible");
    const stockMinimo = parseDecimalValue(data.stock_minimo, "stock_minimo");
    const stockMaximo = parseDecimalValue(data.stock_maximo, "stock_maximo");

    if (cantidadDisponible !== undefined) payload.cantidad_disponible = cantidadDisponible;
    if (stockMinimo !== undefined) payload.stock_minimo = stockMinimo;
    if (stockMaximo !== undefined) payload.stock_maximo = stockMaximo;
    if (data.fecha_vencimiento !== undefined) {
        if (!data.fecha_vencimiento) {
            payload.fecha_vencimiento = null;
        } else {
            const fecha = new Date(data.fecha_vencimiento);
            if (Number.isNaN(fecha.getTime())) {
                throw createHttpError(400, "fecha_vencimiento inválida");
            }

            payload.fecha_vencimiento = fecha;
        }
    }

    return payload;
};

export const getMateriaPrima = async () => {
    return prisma.materia_prima.findMany({
        orderBy: { id: "desc" }
    });
};

export const getMateriaPrimaById = async (id) => {
    const materiaPrimaId = parseBigIntId(id, "materia_prima_id");

    const materiaPrima = await prisma.materia_prima.findUnique({
        where: { id: materiaPrimaId }
    });

    if (!materiaPrima) {
        throw createHttpError(404, "Materia prima no encontrada");
    }

    return materiaPrima;
};

export const createMateriaPrima = async (data) => {
    if (!data?.nombre || !String(data.nombre).trim()) {
        throw createHttpError(400, "nombre es requerido");
    }

    const payload = buildMateriaPrimaData(data);

    if (!payload.nombre) {
        throw createHttpError(400, "nombre es requerido");
    }

    return prisma.materia_prima.create({
        data: {
            ...payload,
            nombre: payload.nombre,
            cantidad_disponible: payload.cantidad_disponible ?? 0,
            stock_minimo: payload.stock_minimo ?? 0,
            stock_maximo: payload.stock_maximo ?? 999999,
            unidad_medida: payload.unidad_medida ?? "unidad",
            estado_inventario: payload.estado_inventario ?? "activo"
        }
    });
};

export const updateMateriaPrima = async (id, data) => {
    const materiaPrimaId = parseBigIntId(id, "materia_prima_id");
    await prisma.materia_prima.findUnique({
        where: { id: materiaPrimaId }
    }).then((materiaPrima) => {
        if (!materiaPrima) {
            throw createHttpError(404, "Materia prima no encontrada");
        }
    });

    const payload = buildMateriaPrimaData(data);

    if (Object.keys(payload).length === 0) {
        throw createHttpError(400, "No hay datos para actualizar");
    }

    return prisma.materia_prima.update({
        where: { id: materiaPrimaId },
        data: {
            ...payload,
            updated_at: new Date()
        }
    });
};

export const deleteMateriaPrima = async (id) => {
    const materiaPrimaId = parseBigIntId(id, "materia_prima_id");
    const materiaPrima = await prisma.materia_prima.findUnique({
        where: { id: materiaPrimaId }
    });

    if (!materiaPrima) {
        throw createHttpError(404, "Materia prima no encontrada");
    }

    const movimientos = await prisma.movimientos_inventario.count({
        where: { materia_prima_id: materiaPrimaId }
    });

    if (movimientos > 0) {
        throw createHttpError(400, "No se puede eliminar una materia prima con movimientos registrados");
    }

    await prisma.materia_prima.delete({
        where: { id: materiaPrimaId }
    });

    return { message: "Materia prima eliminada correctamente" };
};