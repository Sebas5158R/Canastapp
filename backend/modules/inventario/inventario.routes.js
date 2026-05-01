import { Router } from "express";
import materiaPrimaRoutes from "./materia_prima.routes.js";
import movimientosInventarioRoutes from "./movimientos_inventario.routes.js";

const router = Router();

router.use("/materia-prima", materiaPrimaRoutes);
router.use("/movimientos", movimientosInventarioRoutes);

export default router;