import chalk from "chalk";
import { Command } from "commander";
import fs from "fs";
import inquirer from "inquirer";

export const makeSchemaCommand = new Command("make:schema")
  .description("Create a new schema")
  .action(async () => {
    const { name } = await inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "Enter schema name:",
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
    const { module: moduleName } = await inquirer.prompt([
      {
        name: "module",
        type: "input",
        message: "Enter module name: ",
        default: name,
      },
    ]);

    try {
      // generate schema file dynamically
      await makeSchema(name, moduleName);
      console.log(chalk.green(`Schema ${name} created successfully!`));
    } catch (error) {
      console.error(chalk.red((error as any).message));
    }
  });

export const makeSchema = async (name: string, moduleName: string = name) => {
  const data = fs.readFileSync("./src/baseFiles/user.schema.ts", "utf-8");
  const schema = data
    .replace(/User/g, name)
    .replace(/user/g, name.toLowerCase());

  // find module folder
  // if not found create one
  if (!fs.existsSync(`./src/modules`)) {
    fs.mkdirSync(`./src/modules`);
  }
  if (!fs.existsSync(`./src/modules/${moduleName.toLowerCase()}`)) {
    fs.mkdirSync(`./src/modules/${moduleName.toLowerCase()}`);
  }
  //   check if schema file already exists
  if (
    fs.existsSync(`./src/modules/${moduleName}/${name.toLowerCase()}.schema.ts`)
  ) {
    throw new Error("Schema already exists", { cause: "Exist" });
  }

  fs.writeFileSync(
    `./src/modules/${moduleName}/${name.toLowerCase()}.schema.ts`,
    schema
  );
};
