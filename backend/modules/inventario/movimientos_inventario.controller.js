import * as service from "./movimientos_inventario.service.js";

export const getMovimientosInventario = async (req, res, next) => {
    try {
        const data = await service.getMovimientosInventario();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const getMovimientoInventarioById = async (req, res, next) => {
    try {
        const data = await service.getMovimientoInventarioById(req.params.id);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const createMovimientoInventario = async (req, res, next) => {
    try {
        const data = await service.createMovimientoInventario(req.body);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};