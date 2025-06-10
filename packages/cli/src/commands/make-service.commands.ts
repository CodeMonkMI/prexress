import chalk from "chalk";
import { Command } from "commander";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";

export const makeServiceCommand = new Command("make:service")
  .description("Create a new service")
  .action(async () => {
    const { name } = await inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "Enter service name:",
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
      // generate service file dynamically
      await makeService(name, moduleName);
      console.log(
        chalk.green(
          `Service ${name} created successfully in ${moduleName} module`
        )
      );
    } catch (error) {
      console.error(chalk.red((error as any).message));
    }
  });

export const makeService = async (name: string, moduleName: string = name) => {
  const pathName = path.resolve(__dirname, "../baseFiles/user.service.ts");
  const data = fs.readFileSync(pathName, "utf-8");
  const service = data
    .replace(/User/g, name)
    .replace(/user/g, name.toLowerCase());

  // find modules name folder if not then create
  if (!fs.existsSync(`./src/modules`)) {
    fs.mkdirSync(`./src/modules`);
  }
  // find module folder if not then create
  if (!fs.existsSync(`./src/modules/${moduleName.toLowerCase()}`)) {
    fs.mkdirSync(`./src/modules/${moduleName.toLowerCase()}`);
  }

  //   check if service file already exists
  if (
    fs.existsSync(
      `./src/modules/${moduleName}/${name.toLowerCase()}.service.ts`
    )
  ) {
    throw new Error("Service already exists", { cause: "Exist" });
  }

  fs.writeFileSync(
    `./src/modules/${moduleName}/${name.toLowerCase()}.service.ts`,
    service
  );
};
