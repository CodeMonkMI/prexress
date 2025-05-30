import { Prisma } from "@prisma/client";

export interface IBaseSelector<TDelegate> {
  base: Prisma.Args<TDelegate, "findMany">["select"];
  find: Prisma.Args<TDelegate, "findMany">["select"];
  findOne: Prisma.Args<TDelegate, "findFirst">["select"];
  findById: Prisma.Args<TDelegate, "findUnique">["select"];
  create: Prisma.Args<TDelegate, "create">["select"];
  update: Prisma.Args<TDelegate, "update">["select"];
  delete: Prisma.Args<TDelegate, "delete">["select"];
}
