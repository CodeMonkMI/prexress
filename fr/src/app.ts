import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import { UserController } from "./controllers/user.controller";
import registerController from "./lib/core/controller/registerControllers";

dotenv.config();

export function createApp() {
  const app: Express = express();

  // basic middlewares
  app.use(cors({ origin: true }));
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // health route
  app.get("/health", (req: Request, res: Response): any => {
    try {
      return res.status(200).json({ message: "UP" });
    } catch (e) {
      return res.status(500).json({ message: "DOWN" });
    }
  });

  app.get("/", (req: Request, res: Response) => {
    console.log("object");
  });

  registerController(app, [UserController]);

  // 404 not found handler
  app.use((_req, res: Response) => {
    res.status(404).json({ message: "Not found" });
  });

  // 500 internal server error handler
  app.use((err: any, _req: any, res: Response, _next: any) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  });

  return app;
}
