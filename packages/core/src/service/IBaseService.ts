import { FilterOptions, ID } from "@/repository/IBaseRepository";
import { SQLWrapper } from "drizzle-orm";
import { MySqlTable } from "drizzle-orm/mysql-core";
import { PgTable } from "drizzle-orm/pg-core";

export interface IBaseService<
  TTable extends (PgTable | MySqlTable) & { id: SQLWrapper },
> {
  findAll(options?: FilterOptions): Promise<TTable["$inferSelect"][]>;
  findById(id: ID): Promise<TTable["$inferSelect"] | null>;

  create(data: TTable["$inferInsert"]): Promise<TTable["$inferSelect"]>;

  update(
    id: ID,
    data: Partial<TTable["$inferInsert"]>
  ): Promise<TTable["$inferSelect"] | null>;

  delete(id: ID): Promise<void>;
}
