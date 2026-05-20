import { Router } from "express";
import * as controller from "./ordenes-produccion.controller.js";
import { authenticateJWT } from "../../middlewares/jwt.middleware.js";
import { requirePermission } from "../../middlewares/authorization.middleware.js";
import { PERMISSIONS } from "../usuarios/permissions.constants.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

// ── Órdenes ──────────────────────────────────────────────
// GET  /ordenes-produccion              → lista (con ?estado=pendiente)
// GET  /ordenes-produccion/historial    → solo completadas + canceladas
// GET  /ordenes-produccion/:id          → detalle completo
// POST /ordenes-produccion              → crear orden
// PATCH /ordenes-produccion/:id/estado  → cambiar estado

router.get(
  "/",
  requirePermission(PERMISSIONS.VIEW_PRODUCTION, PERMISSIONS.MANAGE_ORDERS),
  controller.getOrdenes
);

router.get(
  "/historial",
  requirePermission(PERMISSIONS.VIEW_PRODUCTION, PERMISSIONS.MANAGE_ORDERS),
  controller.getHistorial
);

router.get(
  "/:id",
  requirePermission(PERMISSIONS.VIEW_PRODUCTION, PERMISSIONS.MANAGE_ORDERS),
  controller.getOrdenById
);

router.post(
  "/",
  requirePermission(PERMISSIONS.MANAGE_ORDERS),
  controller.createOrden
);

router.patch(
  "/:id/estado",
  requirePermission(PERMISSIONS.MANAGE_ORDERS, PERMISSIONS.REGISTER_PRODUCTION),
  controller.actualizarEstado
);

// ── Registro de Producción ────────────────────────────────
// GET  /ordenes-produccion/:id/registros   → registros de una orden
// POST /registros-produccion               → crear registro

router.get(
  "/:id/registros",
  requirePermission(PERMISSIONS.VIEW_PRODUCTION, PERMISSIONS.MANAGE_ORDERS),
  controller.getRegistrosPorOrden
);

// ── Entregas ──────────────────────────────────────────────
// GET  /ordenes-produccion/:id/entregas    → entregas de una orden

router.get(
  "/:id/entregas",
  requirePermission(PERMISSIONS.VIEW_PRODUCTION, PERMISSIONS.MANAGE_ORDERS),
  controller.getEntregasPorOrden
);

// ── Trazabilidad ──────────────────────────────────────────
// GET  /ordenes-produccion/:id/trazabilidad

router.get(
  "/:id/trazabilidad",
  requirePermission(PERMISSIONS.VIEW_PRODUCTION, PERMISSIONS.MANAGE_ORDERS),
  controller.getTrazabilidadPorOrden
);

export default router;