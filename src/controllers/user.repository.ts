import { BaseRepository } from "@/lib/core/BaseRepository";
import { Prisma } from "@prisma/client";

export class UserRepository extends BaseRepository<Prisma.UserDelegate> {
  protected readonly model = "user";
}
