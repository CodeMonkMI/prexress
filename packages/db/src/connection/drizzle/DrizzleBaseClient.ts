import { Pool } from "pg";
import { Client, IDatabase } from "../IDatabaseClient";

export abstract class DrizzleBaseClientPool implements IDatabase {
  protected isConnect = false;
  protected abstract pool: Pool | null;
  protected abstract client: Client | null;

  async connect(): Promise<void> {
    try {
      await this.pool?.connect();
      console.log("data connected!");
      this.isConnect = true;
    } catch (error) {
      console.log("Failed to connect to database", error);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.pool?.end();
      this.isConnect = false;
    } catch (error) {
      console.log("Failed to disconnect to database", error);
    }
  }

  getClient() {
    if (!this.isConnect || !this.client) {
      throw new Error("Database is not connected");
    }
    return this.client;
  }

  isConnected(): boolean {
    return this.isConnect;
  }

  async executeQuery<T>(
    label: string,
    queryFn: (db: Client) => Promise<T>
  ): Promise<T> {
    const start = performance.now();

    try {
      const result = await queryFn(this.client!);
      const duration = performance.now() - start;

      console.log(`[${label}] completed in ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`[${label}] failed in ${duration.toFixed(2)}ms`);
      console.log(error);

      throw new Error(`[${label}] Database query failed`);
    }
  }
}
