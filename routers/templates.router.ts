import { Router } from "express";
import { getAllTemplates } from "../controllers/templates.controller";

export const usersRouter = Router();

usersRouter.get("/", getAllTemplates);
