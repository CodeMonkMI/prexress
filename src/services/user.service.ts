import { BaseService } from "@/lib/core/service/BaseService";
import { Prisma } from "@prisma/client";

export class UserService extends BaseService<Prisma.UserDelegate> {}
