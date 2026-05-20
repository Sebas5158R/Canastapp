import { Router } from "express";
import * as controller from "./ordenes-produccion.controller.js";
import { authenticateJWT } from "../../middlewares/jwt.middleware.js";
import { requirePermission } from "../../middlewares/authorization.middleware.js";
import { PERMISSIONS } from "../usuarios/permissions.constants.js";

const router = Router();

router.use(authenticateJWT);

// POST /registros-produccion
router.post(
  "/",
  requirePermission(PERMISSIONS.REGISTER_PRODUCTION, PERMISSIONS.MANAGE_ORDERS),
  controller.crearRegistroProduccion
);

export default router;