import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import usuarioRoutes from "../modules/usuarios/usuario.routes.js";
import inventarioRoutes from "../modules/inventario/inventario.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/inventario", inventarioRoutes);

export default router;