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
    const normalized = Number(value);

    if (Number.isNaN(normalized) || normalized <= 0) {
        throw createHttpError(400, `${fieldName} debe ser un número mayor a 0`);
    }

    return normalized;
};

const buildMovimientoData = (data) => ({
    materia_prima_id: data.materia_prima_id,
    tipo_movimiento: String(data.tipo_movimiento || "").trim().toLowerCase(),
    cantidad: parseDecimalValue(data.cantidad, "cantidad"),
    usuario_id: data.usuario_id,
    orden_produccion_id: data.orden_produccion_id,
    observaciones: data.observaciones?.trim() || null
});

export const getMovimientosInventario = async () => {
    return prisma.movimientos_inventario.findMany({
        orderBy: { fecha_movimiento: "desc" },
        include: {
            materia_prima: true,
            usuarios: true
        }
    });
};

export const getMovimientoInventarioById = async (id) => {
    const movimientoId = parseBigIntId(id, "movimiento_inventario_id");

    const movimiento = await prisma.movimientos_inventario.findUnique({
        where: { id: movimientoId },
        include: {
            materia_prima: true,
            usuarios: true
        }
    });

    if (!movimiento) {
        throw createHttpError(404, "Movimiento de inventario no encontrado");
    }

    return movimiento;
};

export const createMovimientoInventario = async (data) => {
    const payload = buildMovimientoData(data);
    const materiaPrimaId = parseBigIntId(payload.materia_prima_id, "materia_prima_id");

    if (!payload.tipo_movimiento) {
        throw createHttpError(400, "tipo_movimiento es requerido");
    }

    if (!["entrada", "salida"].includes(payload.tipo_movimiento)) {
        throw createHttpError(400, "tipo_movimiento debe ser 'entrada' o 'salida'");
    }

    return prisma.$transaction(async (tx) => {
        const materiaPrima = await tx.materia_prima.findUnique({
            where: { id: materiaPrimaId }
        });

        if (!materiaPrima) {
            throw createHttpError(404, "Materia prima no encontrada");
        }

        const cantidadActual = Number(materiaPrima.cantidad_disponible);
        const cantidadMovimiento = payload.tipo_movimiento === "salida" ? -payload.cantidad : payload.cantidad;
        const nuevoStock = cantidadActual + cantidadMovimiento;

        if (nuevoStock < 0) {
            throw createHttpError(400, "Stock insuficiente para registrar la salida");
        }

        const movimiento = await tx.movimientos_inventario.create({
            data: {
                materia_prima_id: materiaPrimaId,
                tipo_movimiento: payload.tipo_movimiento,
                cantidad: payload.cantidad,
                usuario_id: payload.usuario_id ? parseBigIntId(payload.usuario_id, "usuario_id") : null,
                orden_produccion_id: payload.orden_produccion_id ? parseBigIntId(payload.orden_produccion_id, "orden_produccion_id") : null,
                observaciones: payload.observaciones
            },
            include: {
                materia_prima: true,
                usuarios: true
            }
        });

        await tx.materia_prima.update({
            where: { id: materiaPrimaId },
            data: {
                cantidad_disponible: nuevoStock,
                updated_at: new Date(),
                estado_inventario: nuevoStock <= 0 ? "sin_stock" : "activo"
            }
        });

        return movimiento;
    });
};