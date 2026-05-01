import { Router } from "express";
import usuarioRoutes from "../modules/usuarios/usuario.routes.js";
import inventarioRoutes from "../modules/inventario/inventario.routes.js";

const router = Router();

router.use("/usuarios", usuarioRoutes);
router.use("/inventario", inventarioRoutes);

export default router;