import { BaseRepository } from "@/lib/core/repository/BaseRepository";
import { DatabaseClientPool } from "@/lib/db/DatabaseClientPool";
import { Prisma } from "@prisma/client";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserRepository extends BaseRepository<Prisma.UserDelegate> {
  constructor(@inject(DatabaseClientPool) database: DatabaseClientPool) {
    super(database, "user");
  }
}
