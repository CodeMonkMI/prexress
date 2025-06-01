import { UserRepository } from "@/modules/user/user.repository";
import { BaseService } from "@pxr/core";
import { autoInjectable } from "tsyringe";
import { UsersTable } from "./user.schema";

@autoInjectable()
export class UserService extends BaseService<
  typeof UsersTable,
  UserRepository
> {}

export const UserServiceToken = Symbol("UserServiceToken");
