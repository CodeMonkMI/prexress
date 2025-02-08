import { UserService } from "@/services/user.service";
import { NextFunction, Request, Response } from "express";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async find(_req: Request, res: Response, _next: NextFunction) {
    console.log("user controller find");
    const data = await this.userService.find();
    return res.status(200).json(data);
  }
  async create(req: Request, res: Response, next: NextFunction) {
    const newData = this.userService.create(req.body());
    return res.status(200).json(newData);
  }
}
