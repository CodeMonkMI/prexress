import { BaseRepository } from "@/lib/core/BaseRepository";
import { DatabaseClientPool } from "@/lib/db/DatabaseClientPool";
import { Prisma } from "@prisma/client";

export class UserRepository extends BaseRepository<Prisma.UserDelegate> {
  constructor(database: DatabaseClientPool) {
    super(database, "user");
  }
}

const a = new UserRepository(new DatabaseClientPool());
