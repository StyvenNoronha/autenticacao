import { Router } from "express";
import * as controller from "../controllers/inicio.controller";
import * as authController from "../controllers/auth.controller";

export const mainRouter = Router();

mainRouter.get("/", controller.ping);
mainRouter.post("/auth/signin", authController.auth);
mainRouter.post("/auth/signup", authController.signup);
mainRouter.post("/auth/useopt", authController.useOpt);
