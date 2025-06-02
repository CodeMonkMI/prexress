import { BaseRepository } from "@pxr/core";
import { DatabaseClientToken, type IDatabaseClient } from "@pxr/db";
import { autoInjectable, inject } from "tsyringe";
import { UsersTable } from "./user.schema";
@autoInjectable()
export class UserRepository extends BaseRepository<typeof UsersTable> {
  constructor(@inject(DatabaseClientToken) databaseClient: IDatabaseClient) {
    super(databaseClient, UsersTable);
  }
}
