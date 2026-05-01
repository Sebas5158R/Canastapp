import { Router } from "express";
import * as controller from "./materia_prima.controller.js";

const router = Router();

router.get("/", controller.getMateriaPrima);
router.get("/:id", controller.getMateriaPrimaById);
router.post("/", controller.createMateriaPrima);
router.patch("/:id", controller.updateMateriaPrima);
router.delete("/:id", controller.deleteMateriaPrima);

export default router;