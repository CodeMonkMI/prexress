import { UserService } from "@/modules/user/user.service";
import { Controller, GET, POST } from "@pxr/core";
import { NextFunction, Request, Response } from "express";
import { autoInjectable } from "tsyringe";

@autoInjectable()
@Controller("/user")
export class UserController {
  constructor(readonly userService: UserService) {}

  @GET("/")
  async find(_req: Request, res: Response, _next: NextFunction) {
    console.log("user controller find");
    const data = await this.userService.findAll();
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
