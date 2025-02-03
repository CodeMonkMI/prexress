import { Prisma } from "@prisma/client";

export type ID = string | number;

export interface IBaseRepository<TModel> {
  findAll(options: Prisma.Args<TModel, "findMany">["where"]): Promise<TModel[]>;
  findOne(options: Prisma.Args<TModel, "findFirst">["where"]): Promise<TModel>;
  findById(id: ID): Promise<TModel>;
  findAndCount(
    options: Prisma.Args<TModel, "findMany">["where"]
  ): Promise<[TModel[], number]>;

  count(where: Prisma.Args<TModel, "findMany">["where"]): Promise<number>;
  checkExists(
    where: Prisma.Args<TModel, "findFirst">["where"]
  ): Promise<boolean>;

  // mutation: create
  // Instead of Promise<any>
  create(
    data: Prisma.Args<TModel, "create">["data"]
  ): Promise<
    Prisma.Result<
      TModel,
      { data: Prisma.Args<TModel, "create">["data"] },
      "create"
    >
  >;

  // Instead of Promise<any>
  update(
    id: ID,
    data: Prisma.Args<TModel, "update">["data"]
  ): Promise<
    Prisma.Result<
      TModel,
      { data: Prisma.Args<TModel, "update">["data"] },
      "update"
    >
  >;

  updateMany(
    where: Prisma.Args<TModel, "findMany">["where"],
    data: Prisma.Args<TModel, "update">["data"][]
  ): Promise<any>;

  // mutation: delete
  delete(id: ID): Promise<Boolean>;
  deleteMany(ids: ID[]): Promise<Boolean[]>;
}
