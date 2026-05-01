import * as service from "./materia_prima.service.js";

export const getMateriaPrima = async (req, res, next) => {
    try {
        const data = await service.getMateriaPrima();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const getMateriaPrimaById = async (req, res, next) => {
    try {
        const data = await service.getMateriaPrimaById(req.params.id);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const createMateriaPrima = async (req, res, next) => {
    try {
        const data = await service.createMateriaPrima(req.body);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};

export const updateMateriaPrima = async (req, res, next) => {
    try {
        const data = await service.updateMateriaPrima(req.params.id, req.body);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const deleteMateriaPrima = async (req, res, next) => {
    try {
        const data = await service.deleteMateriaPrima(req.params.id);
        res.json(data);
    } catch (error) {
        next(error);
    }
};