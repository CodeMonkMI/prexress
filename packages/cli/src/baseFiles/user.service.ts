import { BaseService } from "@prexress/core";
import { autoInjectable } from "tsyringe";
import { UserRepository } from "./user.repository";
import { UsersTable } from "./user.schema";

@autoInjectable()
export class UserService extends BaseService<
  typeof UsersTable,
  UserRepository
> {
  constructor(repository: UserRepository) {
    super(repository);
  }
}

export const UserServiceToken = Symbol("UserServiceToken");
