import { BaseSelector } from "@/lib/core/selector/BaseSelector";
import { Prisma } from "@prisma/client";
import { singleton } from "tsyringe";

@singleton()
export class UserSelector extends BaseSelector<Prisma.UserDelegate> {
  getBase(): Prisma.Args<Prisma.UserDelegate, "findMany">["select"] {
    return {
      id: true,
    };
  }
}
