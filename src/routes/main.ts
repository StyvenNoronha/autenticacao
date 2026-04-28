import { Router } from "express";
import * as controller from "../controllers/inicio.controller";

export const mainRouter = Router();

mainRouter.get("/", controller.ping);
