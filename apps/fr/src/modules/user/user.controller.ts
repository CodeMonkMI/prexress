import { UserService } from "@/modules/user/user.service";
import { Controller, GET, POST } from "@prexress/core";
import { type NextFunction, type Request, type Response } from "express";
import { autoInjectable } from "tsyringe";

@autoInjectable()
@Controller("/user")
export class UserController {
  constructor(readonly userService: UserService) {}

  @GET("/")
  async find(_req: Request, res: Response, next: NextFunction) {
    try {
      console.log("user controller find");
      const data = await this.userService.findAll();
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  @POST("/")
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body || Object.keys(req.body).length <= 0) {
        throw new Error("No body");
      }
      const newData = await this.userService.create(req.body);
      return res.status(200).json(newData);
    } catch (error) {
      next(error);
    }
  }
}

export const UserControllerToken = Symbol("UserControllerToken");
