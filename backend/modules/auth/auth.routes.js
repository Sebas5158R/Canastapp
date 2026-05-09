import { Router } from "express";
import * as controller from "./auth.controller.js";
import { authenticateJWT } from "../../middlewares/jwt.middleware.js";

const router = Router();

router.post("/login", controller.login);
router.get("/me", authenticateJWT, controller.me);

export default router;