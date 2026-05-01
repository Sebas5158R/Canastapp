import { Router } from "express";
import * as controller from "./movimientos_inventario.controller.js";

const router = Router();

router.get("/", controller.getMovimientosInventario);
router.get("/:id", controller.getMovimientoInventarioById);
router.post("/", controller.createMovimientoInventario);

export default router;