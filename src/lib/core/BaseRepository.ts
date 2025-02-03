import { Prisma, PrismaClient } from "@prisma/client";
import { DatabaseClientPool } from "../db/DatabaseClientPool";
import { IBaseRepository, ID } from "./IBaseRepository";

// Update the BaseRepository class definition to include the delegate type
export abstract class BaseRepository<
  TDelegate,
  TModalKey extends keyof PrismaClient = keyof PrismaClient
> implements IBaseRepository<TDelegate>
{
  constructor(
    private readonly database: DatabaseClientPool,
    private readonly modelKey: TModalKey
  ) {}

  async findAll(
    options: Prisma.Args<TDelegate, "findMany">["where"]
  ): Promise<TDelegate[]> {
    return this.database.executeQuery("Find All", (db: PrismaClient) => {
      const modelDelegate = db[this.modelKey] as any;

      return modelDelegate.findMany({
        where: options,
      });
    });
  }
  findOne(
    options: Prisma.Args<TDelegate, "findFirst">["where"]
  ): Promise<TDelegate> {
    return this.database.executeQuery("Find One", (db: PrismaClient) => {
      const modelDelegate = db[this.modelKey] as any;

      return modelDelegate.findFirst({
        where: options,
      });
    });
  }
  findById(id: ID): Promise<TDelegate> {
    return this.database.executeQuery("Find By Id", (db: PrismaClient) => {
      const modelDelegate = db[this.modelKey] as any;
      return modelDelegate.findFirst({
        where: {
          id,
        },
      });
    });
  }
  async findAndCount(
    options: Prisma.Args<TDelegate, "findMany">["where"]
  ): Promise<[TDelegate[], number]> {
    return this.database.executeQuery(
      "Find and Count",
      async (db: PrismaClient) => {
        const modelDelegate = db[this.modelKey] as any;

        const data = modelDelegate.findFirst({
          where: options,
        });
        const count = await this.count(options);

        return [data, count];
      }
    );
  }

  count(where: Prisma.Args<TDelegate, "findMany">["where"]): Promise<number> {
    return this.database.executeQuery("Count", (db: PrismaClient) => {
      const modelDelegate = db[this.modelKey] as any;

      return modelDelegate.count({
        where,
      });
    });
  }

  // mutation: create
  create(data: Prisma.Args<TDelegate, "create">["data"]): Promise<any> {
    return this.database.executeQuery("Create", (db: PrismaClient) => {
      const modelDelegate = db[this.modelKey] as any;
      return modelDelegate.create({
        data,
      });
    });
  }
  createMany(data: Prisma.Args<TDelegate, "create">["data"][]): Promise<any[]> {
    return this.database.executeQuery("Create Many", (db: PrismaClient) => {
      const modelDelegate = db[this.modelKey] as any;
      return modelDelegate.createMany({
        data,
      });
    });
  }

  // mutation: update
  update(
    id: ID,
    data: Prisma.Args<TDelegate, "update">["data"]
  ): Promise<
    Prisma.Result<
      TDelegate,
      { data: Prisma.Args<TDelegate, "update">["data"] },
      "update"
    >
  > {
    return this.database.executeQuery("Update", (db: PrismaClient) => {
      const modelDelegate = db[this.modelKey] as any;
      return modelDelegate.update({
        where: {
          id,
        },
        data,
      });
    });
  }
  updateMany(
    where: Prisma.Args<TDelegate, "findMany">["where"],
    data: Prisma.Args<TDelegate, "update">["data"][]
  ): Promise<TDelegate[]> {
    return this.database.executeQuery("Update Many", (db: PrismaClient) => {
      const modelDelegate = db[this.modelKey] as any;
      return modelDelegate.updateMany({
        where,
        data,
      });
    });
  }

  // mutation: delete
  delete(id: ID): Promise<Boolean> {
    return this.database.executeQuery("Delete", (db: PrismaClient) => {
      const modelDelegate = db[this.modelKey] as any;
      return modelDelegate.delete({
        where: {
          id,
        },
      });
    });
  }
  deleteMany(ids: ID[]): Promise<Boolean[]> {
    return this.database.executeQuery("Delete Many", (db: PrismaClient) => {
      const modelDelegate = db[this.modelKey] as any;
      return modelDelegate.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    });
  }

  checkExists(
    where: Prisma.Args<TDelegate, "findFirst">["where"]
  ): Promise<boolean> {
    return this.database.executeQuery(
      "Check Exists",
      async (db: PrismaClient) => {
        const modelDelegate = db[this.modelKey] as any;

        const data = await modelDelegate.findFirst({
          where,
        });
        return !!data;
      }
    );
  }
}
