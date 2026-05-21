import * as service from "./usuario.service.js";

export const getUsuarios = async(req, res, next) => {
    try {
        const data = await service.getUsuarios();
        res.json(data);
    } catch(error) {
        next(error);
    }
}

export const createUsuario = async (req, res, next) => {
    try {
        const data = await service.createUsuario(req.body);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};

export const updateUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await service.updateUsuario(id, req.body);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const deleteUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await service.deleteUsuario(id);
        res.json(data);
    } catch (error) {
        next(error);
    }
};
