import { Controller } from "@/lib/decorator/controller.decorator";
import { GET, POST } from "@/lib/decorator/router.decorator";
import { UserService } from "@/services/user.service";
import { NextFunction, Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GET("/all")
  async find(_req: Request, res: Response, _next: NextFunction) {
    console.log("user controller find");
    const data = await this.userService.find();
    return res.status(200).json(data);
  }
  @POST("/create")
  async create(req: Request, res: Response, next: NextFunction) {
    const newData = this.userService.create(req.body());
    return res.status(200).json(newData);
  }
}
