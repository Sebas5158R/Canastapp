import { Router } from "express";
import * as controller from "./materia_prima.controller.js";
import { authenticateJWT } from "../../middlewares/jwt.middleware.js";
import { requirePermission } from "../../middlewares/authorization.middleware.js";
import { PERMISSIONS } from "../usuarios/permissions.constants.js";

const router = Router();

router.get("/", authenticateJWT, requirePermission(PERMISSIONS.VIEW_INVENTORY), controller.getMateriaPrima);
router.get("/:id", authenticateJWT, requirePermission(PERMISSIONS.VIEW_INVENTORY), controller.getMateriaPrimaById);
router.post("/", authenticateJWT, requirePermission(PERMISSIONS.MANAGE_INVENTORY), controller.createMateriaPrima);
router.patch("/:id", authenticateJWT, requirePermission(PERMISSIONS.MANAGE_INVENTORY), controller.updateMateriaPrima);
router.delete("/:id", authenticateJWT, requirePermission(PERMISSIONS.MANAGE_INVENTORY), controller.deleteMateriaPrima);

export default router;