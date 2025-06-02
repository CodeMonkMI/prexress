import { BaseRepository } from "@/repository/BaseRepository";
import { FilterOptions, ID } from "@/repository/IBaseRepository";
import { SQLWrapper } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { IBaseService } from "./IBaseService";

export abstract class BaseService<
  TTable extends PgTable & { id: SQLWrapper },
  TRepository extends BaseRepository<TTable> = BaseRepository<TTable>,
> implements IBaseService<TTable>
{
  constructor(protected readonly repository: TRepository) {}

  findAll(options?: FilterOptions): Promise<TTable["$inferSelect"][]> {
    try {
      return this.repository.findAll(options);
    } catch (error) {
      console.log(error);
      throw new Error(`[Base service] FindAll Fetched failed `);
    }
  }
  findById(id: ID): Promise<TTable["$inferSelect"] | null> {
    try {
      return this.repository.findById(id);
    } catch (error) {
      throw new Error(`[Base service] FindAll Fetched failed `);
    }
  }
  create(data: TTable["$inferInsert"]): Promise<TTable["$inferSelect"]> {
    try {
      return this.repository.create(data);
    } catch (error) {
      throw new Error(`[Base service] FindAll Fetched failed `);
    }
  }
  update(
    id: ID,
    data: Partial<TTable["$inferInsert"]>
  ): Promise<TTable["$inferSelect"] | null> {
    try {
      return this.repository.update(id, data);
    } catch (error) {
      throw new Error(`[Base service] FindAll Fetched failed `);
    }
  }
  delete(id: ID): Promise<void> {
    try {
      return this.repository.delete(id);
    } catch (error) {
      throw new Error(`[Base service] FindAll Fetched failed `);
    }
  }
}
