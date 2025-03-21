import * as fs from "fs";
import * as path from "path";

type ComponentType =
  | "controller"
  | "repository"
  | "selector"
  | "service"
  | "prisma";

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateController(name: string): string {
  const className = `${capitalizeFirst(name)}Controller`;
  const serviceName = `${capitalizeFirst(name)}Service`;

  return `import { Controller } from "@/lib/core/decorator/controller.decorator";
import { GET, POST } from "@/lib/core/decorator/router.decorator";
import { ${serviceName} } from "@/services/${name}.service";
import { NextFunction, Request, Response } from "express";
import { autoInjectable } from "tsyringe";

@autoInjectable()
@Controller("/${name}")
export class ${className} {
  constructor(readonly ${name}Service: ${serviceName}) {}

  @GET("/")
  async find(_req: Request, res: Response, _next: NextFunction) {
    const data = await this.${name}Service.find();
    return res.status(200).json(data);
  }

  @POST("/")
  async create(req: Request, res: Response, _next: NextFunction) {
    const newData = await this.${name}Service.create(req.body);
    return res.status(200).json(newData);
  }
}

export const ${className}Token = Symbol("${className}Token");
`;
}

function generateRepository(name: string): string {
  const className = `${capitalizeFirst(name)}Repository`;

  return `import { BaseRepository } from "@/lib/core/repository/BaseRepository";
import { DatabaseClientPool } from "@/lib/db/DatabaseClientPool";
import { Prisma } from "@prisma/client";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class ${className} extends BaseRepository<Prisma.${capitalizeFirst(
    name
  )}Delegate> {
  constructor(database: DatabaseClientPool) {
    super(database, "${name}");
  }
}
`;
}

function generateSelector(name: string): string {
  const className = `${capitalizeFirst(name)}Selector`;

  return `import { BaseSelector } from "@/lib/core/selector/BaseSelector";
import { Prisma } from "@prisma/client";
import { singleton } from "tsyringe";

@singleton()
export class ${className} extends BaseSelector<Prisma.${capitalizeFirst(
    name
  )}Delegate> {}
`;
}

function generateService(name: string): string {
  const className = `${capitalizeFirst(name)}Service`;
  const repositoryName = `${capitalizeFirst(name)}Repository`;
  const selectorName = `${capitalizeFirst(name)}Selector`;

  return `import { BaseService } from "@/lib/core/service/BaseService";
import { ${repositoryName} } from "@/repository/${name}.repository";
import { ${selectorName} } from "@/selectors/${name}.selector";
import { Prisma } from "@prisma/client";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class ${className} extends BaseService<Prisma.${capitalizeFirst(
    name
  )}Delegate> {
  constructor(repository: ${repositoryName}, selector: ${selectorName}) {
    super(repository, selector);
  }
}

export const ${className}Token = Symbol("${className}Token");
`;
}

function generatePrismaModel(name: string): string {
  return `model ${capitalizeFirst(name)} {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("${name}")
}
`;
}

function ensureDirectoryExistence(filePath: string): void {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }
  fs.mkdirSync(dirname, { recursive: true });
}

function writeFile(filePath: string, content: string): void {
  ensureDirectoryExistence(filePath);
  fs.writeFileSync(filePath, content);
  console.log(`Created ${filePath}\n\n`);
}

function appendPrismaModelData(projectRoot: string, name: string) {
  const schemaPath = path.join(projectRoot, "prisma", "schema.prisma");
  const schemaContent = fs.readFileSync(schemaPath, "utf-8");
  const modelName = `model ${capitalizeFirst(name)}`;

  if (schemaContent.includes(modelName)) {
    console.log(
      `Model ${name} already exists in schema.prisma. Skipping...\n\n`
    );
    return;
  }
  const modelContent = generatePrismaModel(name);
  fs.appendFileSync(schemaPath, "\n" + modelContent);
  console.log(`Appended ${name} model to schema.prisma\n\n`);
}

function checkAndCreateFile(filePath: string, content: string): void {
  if (!fs.existsSync(filePath)) {
    writeFile(filePath, content);
    return;
  }

  console.log(`File already exists. Skipping file creation.\n\n`);
}

function generate(name: string, type: ComponentType): void {
  // Always use the project root directory
  const projectRoot = path.resolve(__dirname, "..", "..", "..");
  const srcPath = path.join(projectRoot, "src");

  switch (type) {
    case "controller":
      checkAndCreateFile(
        path.join(srcPath, "controllers", `${name}.controller.ts`),
        generateController(name)
      );
      break;
    case "repository":
      checkAndCreateFile(
        path.join(srcPath, "repository", `${name}.repository.ts`),
        generateRepository(name)
      );
      break;
    case "selector":
      checkAndCreateFile(
        path.join(srcPath, "selectors", `${name}.selector.ts`),
        generateSelector(name)
      );
      break;
    case "service":
      checkAndCreateFile(
        path.join(srcPath, "services", `${name}.service.ts`),
        generateService(name)
      );
      break;
    case "prisma":
      // Append the Prisma model to schema.prisma
      appendPrismaModelData(projectRoot, name);
      break;
  }
}

function generateAll(name: string): void {
  const components: ComponentType[] = [
    "controller",
    "repository",
    "selector",
    "service",
    "prisma",
  ];

  components.forEach((component) => {
    console.log(`Generating ${component} for ${name}...`);
    generate(name, component);
  });
}

// CLI interface
const args = process.argv.slice(2);
const usage = `Usage: 
  ts-node generate.ts <name>         # Generate all components
  ts-node generate.ts <name> <type>  # Generate specific component
Types: controller, repository, selector, service, prisma`;

if (args.length === 0) {
  console.log(usage);
  process.exit(1);
}

// generate prisma client
function generatePrismaClient(): void {
  const { execSync } = require("child_process");
  execSync("npx prisma generate", { stdio: "inherit" });
}

const [name, type] = args;

if (!type) {
  generateAll(name);
  generatePrismaClient();
} else {
  if (
    !["controller", "repository", "selector", "service", "prisma"].includes(
      type
    )
  ) {
    console.log(
      "Invalid type. Available types: controller, repository, selector, service, prisma"
    );
    process.exit(1);
  }
  generate(name, type as ComponentType);
  if (type === "prisma") generatePrismaClient();
}
