import { Router } from "express";
import * as controller from "./usuario.controller.js";

const router = Router();

router.get("/", controller.getUsuarios);

export default router;