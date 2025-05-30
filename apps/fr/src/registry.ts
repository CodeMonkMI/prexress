import { container } from "tsyringe";
import { DatabaseClientPool } from "./lib/db/DatabaseClientPool";
import { DatabaseClientToken } from "./lib/db/IDatabaseClient";

export async function resolveDependencies() {
  try {
    const databaseClient = new DatabaseClientPool();

    container.register(DatabaseClientToken, {
      useValue: databaseClient,
    });

    await databaseClient.connect();
  } catch (error) {
    console.log("[registry]: failed to resolve dependencies");
    throw error;
  }
}
