import * as service from "./auth.service.js";

export const login = async (req, res, next) => {
  try {
    const data = await service.login(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const userId = req.tokenPayload?.sub;
    const data = await service.getCurrentUser(userId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};