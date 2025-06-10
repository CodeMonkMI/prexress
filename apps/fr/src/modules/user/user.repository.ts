import { BaseRepository } from "@prexress/core";
import { DatabaseClientToken, type IDatabaseClient } from "@prexress/db";
import { autoInjectable, inject } from "tsyringe";
import { UsersTable } from "./user.schema";
@autoInjectable()
export class UserRepository extends BaseRepository<typeof UsersTable> {
  constructor(@inject(DatabaseClientToken) databaseClient: IDatabaseClient) {
    super(databaseClient, UsersTable);
  }
}
