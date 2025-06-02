import { DatabaseClient, DatabaseClientToken } from "@pxr/db";
import { container } from "tsyringe";

import { readdir } from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";

const modulesDir = path.resolve(__dirname, "modules");

async function getAllSchemaFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return getAllSchemaFiles(fullPath); // recurse
      } else if (entry.isFile() && entry.name.endsWith(".schema.ts")) {
        return [fullPath];
      }
      return [];
    })
  );

  return files.flat();
}

async function loadAllSchemas() {
  try {
    const files = await getAllSchemaFiles(modulesDir);

    const allSchemas: Record<string, any> = {};

    for (const file of files) {
      const moduleExports = await import(pathToFileURL(file).pathname);

      Object.assign(allSchemas, moduleExports);
    }

    return allSchemas;
  } catch (error) {
    console.log(error);
  }
}

export async function resolveDependencies() {
  try {
    const schemas = await loadAllSchemas();

    const dbUrl = process.env.DATABASE_URL || "";
    const databaseClient = new DatabaseClient(dbUrl, schemas);
    container.register(DatabaseClientToken, {
      useValue: databaseClient,
    });
  } catch (error) {
    console.log("[registry]: failed to resolve dependencies");
    throw error;
  }
}
