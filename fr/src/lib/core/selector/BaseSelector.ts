import { Prisma } from "@prisma/client";
import { IBaseSelector } from "./IBaseSelector";
export abstract class BaseSelector<TDelegate>
  implements IBaseSelector<TDelegate>
{
  base: Prisma.Args<TDelegate, "findMany">["select"] = this.getBase();
  find: Prisma.Args<TDelegate, "findMany">["select"] = this.getBase();
  findOne: Prisma.Args<TDelegate, "findFirst">["select"] = this.getBase();
  findById: Prisma.Args<TDelegate, "findUnique">["select"] = this.getBase();
  create: Prisma.Args<TDelegate, "create">["select"] = this.getBase();
  update: Prisma.Args<TDelegate, "update">["select"] = this.getBase();
  delete: Prisma.Args<TDelegate, "delete">["select"] = this.getBase();

  abstract getBase(): Prisma.Args<TDelegate, "findMany">["select"];
}
