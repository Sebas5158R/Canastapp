import * as service from "./productos.service.js";

export const getProductos = async (req, res, next) => {
    try {
        const data = await service.getProductos();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const getProductoById = async (req, res, next) => {
    try {
        const data = await service.getProductoById(req.params.id);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const createProducto = async (req, res, next) => {
    try {
        const data = await service.createProducto(req.body);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};

export const updateProducto = async (req, res, next) => {
    try {
        const data = await service.updateProducto(req.params.id, req.body);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const replaceRecetaProducto = async (req, res, next) => {
    try {
        const data = await service.replaceRecetaProducto(req.params.id, req.body);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const deleteProducto = async (req, res, next) => {
    try {
        const data = await service.deleteProducto(req.params.id);
        res.json(data);
    } catch (error) {
        next(error);
    }
};
