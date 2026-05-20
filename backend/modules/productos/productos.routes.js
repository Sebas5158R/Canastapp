import { Router } from "express";
import * as controller from "./productos.controller.js";

const router = Router();

router.get("/", controller.getProductos);
router.get("/:id", controller.getProductoById);
router.get("/:id/receta", controller.getRecetaByProducto);  // ← NUEVA RUTA
router.post("/:id/validar-stock", controller.validarStockProducto);  // ← NUEVA RUTA
router.post("/", controller.createProducto);
router.patch("/:id", controller.updateProducto);
router.put("/:id/receta", controller.replaceRecetaProducto);
router.delete("/:id", controller.deleteProducto);

export default router;