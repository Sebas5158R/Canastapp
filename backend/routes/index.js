import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import usuarioRoutes from "../modules/usuarios/usuario.routes.js";
import inventarioRoutes from "../modules/inventario/inventario.routes.js";
import productosRoutes from "../modules/productos/productos.routes.js";
import ordenesProduccionRoutes from "../modules/ordenes-produccion/ordenes-produccion.routes.js";
import registrosProduccionRoutes from "../modules/ordenes-produccion/registros-produccion.routes.js";
import entregasProductoRoutes from "../modules/ordenes-produccion/entregas-producto.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/inventario", inventarioRoutes);
router.use("/productos", productosRoutes);
router.use("/ordenes-produccion", ordenesProduccionRoutes);
router.use("/registros-produccion", registrosProduccionRoutes);
router.use("/entregas-producto", entregasProductoRoutes);

export default router;