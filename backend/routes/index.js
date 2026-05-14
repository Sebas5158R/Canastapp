import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import usuarioRoutes from "../modules/usuarios/usuario.routes.js";
import inventarioRoutes from "../modules/inventario/inventario.routes.js";
import productosRoutes from "../modules/productos/productos.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/inventario", inventarioRoutes);
router.use("/productos", productosRoutes);

export default router;