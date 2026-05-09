import { Router } from "express";
import * as controller from "./usuario.controller.js";
import * as rolesController from "./roles.controller.js";
import { authenticateJWT } from "../../middlewares/jwt.middleware.js";
import { requirePermission } from "../../middlewares/authorization.middleware.js";
import { PERMISSIONS } from "./permissions.constants.js";

const router = Router();

router.get("/", authenticateJWT, requirePermission(PERMISSIONS.MANAGE_USERS), controller.getUsuarios);
router.get("/roles", authenticateJWT, requirePermission(PERMISSIONS.MANAGE_USERS), rolesController.getRoles);
router.get("/roles/:nombre/permisos", authenticateJWT, requirePermission(PERMISSIONS.MANAGE_USERS), rolesController.getRolePermissions);

export default router;