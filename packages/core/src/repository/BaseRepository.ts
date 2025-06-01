import { DBClient } from "@pxr/db";
import { eq, inArray, SQLWrapper } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { FilterOptions, IBaseRepository, ID } from "./IBaseRepository";

export class BaseRepository<TTable extends PgTable & { id: SQLWrapper }>
  implements IBaseRepository<TTable>
{
  constructor(
    protected readonly db: DBClient,
    protected readonly table: TTable
  ) {}
  findAll(options?: FilterOptions): Promise<TTable["$inferSelect"][]> {
    const result = this.db.executeQuery("FindAll", async (db) => {
      const query = db
        .select()
        .from(this.table as any)
        .$dynamic();
      const records = await query.execute();
      return records;
    });
    return result;
  }
  findOne(where: SQLWrapper): Promise<TTable["$inferSelect"] | null> {
    const result = this.db.executeQuery("FindOne", async (db) => {
      const records = await db
        .select()
        .from(this.table as any)
        .where(where.getSQL())
        .$dynamic()
        .execute();

      return records[0] ?? null;
    });
    return result;
  }
  findById(id: ID): Promise<TTable["$inferSelect"] | null> {
    const result = this.db.executeQuery("FindById", async (db) => {
      const records = await db
        .select()
        .from(this.table as any)
        .where(eq(this.table.id, id))
        .$dynamic()
        .execute();

      return records[0] ?? null;
    });
    return result;
  }
  async findAndCount(
    options?: FilterOptions
  ): Promise<{ data: TTable["$inferSelect"][]; count: number }> {
    const [records, count] = await Promise.all([
      this.findAll(options),
      this.count(options?.where),
    ]);

    return {
      data: records,
      count: count,
    };
  }
  async count(where?: SQLWrapper): Promise<number> {
    const result = await this.db.executeQuery("Count", async (db) => {
      const query = db
        .select()
        .from(this.table as any)
        .$dynamic();

      if (where) query.where(where.getSQL());

      const records = await query.execute();

      return records.length ?? 0;
    });
    return result;
  }
  async checkExists(where: SQLWrapper): Promise<boolean> {
    const result = await this.count(where);
    return result > 0;
  }
  async create(data: TTable["$inferInsert"]): Promise<TTable["$inferSelect"]> {
    const result = await this.db.executeQuery("Create", async (db) => {
      const records = await db.insert(this.table).values(data).returning();
      return records[0];
    });
    return result!;
  }
  async createMany(
    data: TTable["$inferInsert"][]
  ): Promise<TTable["$inferSelect"][]> {
    const result = await this.db.executeQuery("CreateMany", async (db) => {
      const records = await db
        .insert(this.table as any)
        .values(data)
        .returning();
      return records;
    });
    return result as unknown as TTable["$inferSelect"][];
  }
  async update(
    id: ID,
    data: Partial<TTable["$inferInsert"]>
  ): Promise<TTable["$inferSelect"] | null> {
    const result = await this.db.executeQuery("Update", async (db) => {
      const records = await db
        .update(this.table as any)
        .set(data)
        .where(eq(this.table.id, id));
      return records;
    });
    if (!result) return null;
    return (result as unknown as TTable["$inferSelect"][])[0]!;
  }
  async updateMany(
    data: (TTable["$inferInsert"] & { id: ID })[]
  ): Promise<TTable["$inferSelect"][]> {
    const result = await this.db.executeQuery("UpdateMany", async (db) => {
      return await db.update(this.table as any).set(data);
    });
    return result as unknown as TTable["$inferSelect"][];
  }
  async delete(id: ID): Promise<void> {
    await this.db.executeQuery("Delete", async (db) => {
      await db.delete(this.table as any).where(eq(this.table.id, id));
    });
  }
  async deleteMany(ids: ID[]): Promise<void> {
    await this.db.executeQuery("DeleteMany", async (db) => {
      await db.delete(this.table as any).where(inArray(this.table.id, ids));
    });
  }
}
