import * as service from "./usuario.service.js";

export const getUsuarios = async(req, res, next) => {
    try {
        const data = await service.getUsuarios();
        res.json(data);
    } catch(error) {
        next(error);
    }
}