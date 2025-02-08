// user.router.ts
import { UserController } from "@/controllers/user.controller";
import { DatabaseClientPool } from "@/lib/db/DatabaseClientPool";
import { UserRepository } from "@/repository/user.repository";
import { UserSelector } from "@/selectors/user.selector";
import { UserService } from "@/services/user.service";
import express, { Router } from "express";

export const userController = new UserController(
  new UserService(
    new UserRepository(new DatabaseClientPool()),
    new UserSelector()
  )
);

const userRouter: Router = express.Router();

// Use async middleware to handle promises
userRouter.get("/", userController.find.bind(userController) as any);
userRouter.get("/single/:id", async (req, res, next) => {
  await userController.find(req, res, next);
});

export default userRouter;
