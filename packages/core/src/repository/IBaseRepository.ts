import { SQLWrapper } from "drizzle-orm";
import { MySqlColumn, MySqlTable } from "drizzle-orm/mysql-core";
import { PgColumn, PgTable } from "drizzle-orm/pg-core";

export type ID = string | number;

export type OrderDirection = "asc" | "desc";

export type FilterOptions = {
  where?: SQLWrapper;
  limit?: number;
  orderBy?: {
    column: PgColumn | MySqlColumn;
    direction: OrderDirection;
  };
  offset?: number;
};

export interface IBaseRepository<
  TTable extends (PgTable | MySqlTable) & { id: SQLWrapper },
> {
  findAll(options?: FilterOptions): Promise<TTable["$inferSelect"][]>;
  findOne(where: SQLWrapper): Promise<TTable["$inferSelect"] | null>;
  findById(id: ID): Promise<TTable["$inferSelect"] | null>;
  findAndCount(
    options?: FilterOptions
  ): Promise<{ data: TTable["$inferSelect"][]; count: number }>;

  count(where: SQLWrapper): Promise<number>;
  checkExists(where: SQLWrapper): Promise<boolean>;

  create(data: TTable["$inferInsert"]): Promise<TTable["$inferSelect"]>;

  update(
    id: ID,
    data: Partial<TTable["$inferInsert"]>
  ): Promise<TTable["$inferSelect"] | null>;

  updateMany(
    data: (TTable["$inferInsert"] & { id: ID })[]
  ): Promise<TTable["$inferSelect"][]>;

  // mutation: delete
  delete(id: ID): Promise<void>;
  deleteMany(ids: ID[]): Promise<void>;
}
