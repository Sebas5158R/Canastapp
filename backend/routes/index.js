import { Router } from "express";
import usuarioRoutes from "../modules/usuarios/usuario.routes.js";

const router = Router();

router.use("/usuarios", usuarioRoutes);

export default router;