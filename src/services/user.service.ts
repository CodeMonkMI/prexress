import { BaseService } from "@/lib/core/service/BaseService";
import { UserRepository } from "@/repository/user.repository";
import { UserSelector } from "@/selectors/user.selector";
import { Prisma } from "@prisma/client";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class UserService extends BaseService<Prisma.UserDelegate> {
  constructor(repository: UserRepository, selector: UserSelector) {
    // its required to be here
    super(repository, selector);
  }
}

export const UserServiceToken = Symbol("UserServiceToken");
