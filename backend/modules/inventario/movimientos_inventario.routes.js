import { Router } from "express";
import * as controller from "./movimientos_inventario.controller.js";
import { authenticateJWT } from "../../middlewares/jwt.middleware.js";
import { requirePermission } from "../../middlewares/authorization.middleware.js";
import { PERMISSIONS } from "../usuarios/permissions.constants.js";

const router = Router();

router.get("/", authenticateJWT, requirePermission(PERMISSIONS.VIEW_INVENTORY), controller.getMovimientosInventario);
router.get("/:id", authenticateJWT, requirePermission(PERMISSIONS.VIEW_INVENTORY), controller.getMovimientoInventarioById);
router.post("/", authenticateJWT, requirePermission(PERMISSIONS.REGISTER_INVENTORY_MOVEMENTS), controller.createMovimientoInventario);

export default router;