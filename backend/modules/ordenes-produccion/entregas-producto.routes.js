import { Router } from "express";
import * as controller from "./ordenes-produccion.controller.js";
import { authenticateJWT } from "../../middlewares/jwt.middleware.js";
import { requirePermission } from "../../middlewares/authorization.middleware.js";
import { PERMISSIONS } from "../usuarios/permissions.constants.js";

const router = Router();

router.use(authenticateJWT);

// POST /entregas-producto
router.post(
  "/",
  requirePermission(PERMISSIONS.REGISTER_DELIVERIES, PERMISSIONS.MANAGE_ORDERS),
  controller.registrarEntrega
);

export default router;