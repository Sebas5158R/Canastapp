import * as service from "./ordenes-produccion.service.js";

// ── Órdenes ──────────────────────────────────────────────

export const getOrdenes = async (req, res, next) => {
  try {
    const data = await service.getOrdenes(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getHistorial = async (req, res, next) => {
  try {
    const data = await service.getHistorial();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getOrdenById = async (req, res, next) => {
  try {
    const data = await service.getOrdenById(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createOrden = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id;
    const data = await service.createOrden(req.body, usuarioId);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const actualizarEstado = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id;
    const data = await service.actualizarEstado(req.params.id, req.body, usuarioId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// ── Registro de Producción ────────────────────────────────

export const getRegistrosPorOrden = async (req, res, next) => {
  try {
    const data = await service.getRegistrosPorOrden(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const crearRegistroProduccion = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id;
    const data = await service.crearRegistroProduccion(req.body, usuarioId);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

// ── Entregas ──────────────────────────────────────────────

export const getEntregasPorOrden = async (req, res, next) => {
  try {
    const data = await service.getEntregasPorOrden(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const registrarEntrega = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id;
    const data = await service.registrarEntrega(req.body, usuarioId);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

// ── Trazabilidad ──────────────────────────────────────────

export const getTrazabilidadPorOrden = async (req, res, next) => {
  try {
    const data = await service.getTrazabilidadPorOrden(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};