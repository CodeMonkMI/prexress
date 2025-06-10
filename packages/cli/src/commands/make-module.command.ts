import chalk from "chalk";
import { Command } from "commander";
import fs from "fs";
import inquirer from "inquirer";
import { makeController } from "./make-controller.command";
import { makeMiddleware } from "./make-middleware.commands";
import { makeRepository } from "./make-repository.commands";
import { makeSchema } from "./make-schema.commands";
import { makeService } from "./make-service.commands";

export const makeModuleCommand = new Command("make:module")
  .description("Create a new module with all necessary files")
  .action(async () => {
    const { name } = await inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "Enter module name:",
        filter(input: string) {
          return input.charAt(0).toUpperCase() + input.slice(1);
        },
        validate(input: string) {
          if (!input) {
            return "Please enter a valid name";
          }
          return true;
        },
      },
    ]);

    // generate middleware file dynamically

    try {
      // find modules name folder if not then create
      if (!fs.existsSync(`./src/modules`)) {
        fs.mkdirSync(`./src/modules`);
      }
      // find module folder if not then create
      if (fs.existsSync(`./src/modules/${name.toLowerCase()}`)) {
        throw new Error("Module is already exists", { cause: "Exist" });
      }

      await Promise.all([
        makeSchema(name),
        makeRepository(name),
        makeService(name),
        makeMiddleware(name),
        makeController(name),
      ]);
      console.log(
        chalk.green(`Module ${name} created successfully with all components!`)
      );
    } catch (error) {
      console.error(chalk.red((error as any).message));
    }
  });
