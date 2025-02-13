import { Controller } from "@/lib/core/decorator/controller.decorator";
import { GET, POST } from "@/lib/core/decorator/router.decorator";
import { UserService } from "@/services/user.service";
import { NextFunction, Request, Response } from "express";
import { autoInjectable } from "tsyringe";

@autoInjectable()
@Controller("/user")
export class UserController {
  constructor(readonly userService: UserService) {}

  @GET("/")
  async find(_req: Request, res: Response, _next: NextFunction) {
    console.log("user controller find");
    const data = await this.userService.find();
    return res.status(200).json(data);
  }

  @POST("/")
  async create(req: Request, res: Response, next: NextFunction) {
    console.log("user service created");
    const newData = this.userService.create(req.body);
    return res.status(200).json(newData);
  }
}

export const UserControllerToken = Symbol("UserControllerToken");
