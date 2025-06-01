import { DBClient, DatabaseClientToken } from "@pxr/db";
import { container } from "tsyringe";

export async function resolveDependencies() {
  try {
    const dbUrl = process.env.DATABASE_URL || "";
    const databaseClient = new DBClient(dbUrl, {});

    container.register(DatabaseClientToken, {
      useValue: databaseClient,
    });

    await databaseClient.connect();
  } catch (error) {
    console.log("[registry]: failed to resolve dependencies");
    throw error;
  }
}
