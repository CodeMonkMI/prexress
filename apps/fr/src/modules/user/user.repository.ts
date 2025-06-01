import { BaseRepository } from "@pxr/core";
import { autoInjectable } from "tsyringe";
import { UsersTable } from "./user.schema";

@autoInjectable()
export class UserRepository extends BaseRepository<typeof UsersTable> {}
