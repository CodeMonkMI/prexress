import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Client, DBConnectionString, DBOptions } from "../IDatabaseClient";
import { DrizzleBaseClientPool } from "./DrizzleBaseClient";

export class DrizzleClient extends DrizzleBaseClientPool {
  protected pool: Pool | null = null;
  protected client: Client | null = null;

  constructor(
    readonly url: DBConnectionString,
    readonly schema: any,
    readonly options?: DBOptions
  ) {
    super();

    const pgPool = new Pool({
      connectionString: url,
      ...options,
    });

    this.pool = pgPool;
    this.client = pgDrizzle({
      client: this.pool as Pool,
      schema,
    }) as unknown as Client;

    this.connect();
  }
}
