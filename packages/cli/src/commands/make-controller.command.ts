import chalk from "chalk";
import { Command } from "commander";
import fs from "fs";
import inquirer from "inquirer";

export const makeControllerCommand = new Command("make:controller")
  .description("Create a new controller")
  .action(async () => {
    const { name } = await inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "Enter controller name:",
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
    // generate controller file dynamically

    try {
      await makeController(name, moduleName);
      console.log(
        chalk.green(
          `Controller ${name} created successfully in ${moduleName} module`
        )
      );
    } catch (error) {
      console.error(chalk.red((error as any).message));
    }
  });

export const makeController = async (
  name: string,
  moduleName: string = name
) => {
  const data = fs.readFileSync("./src/baseFiles/user.controller.ts", "utf-8");
  const controller = data
    .replace(/User/g, name)
    .replace(/user/g, name.toLowerCase());

  // find module folder
  // if not found create one
  if (!fs.existsSync(`./src/modules`)) {
    fs.mkdirSync(`./src/modules`);
  }
  if (!fs.existsSync(`./src/modules/${moduleName}`)) {
    fs.mkdirSync(`./src/modules/${moduleName}`);
  }
  //   check if controller file already exists
  if (
    fs.existsSync(
      `./src/modules/${moduleName}/${name.toLowerCase()}.controller.ts`
    )
  ) {
    throw new Error("Controller already exists", { cause: "Exist" });
  }

  fs.writeFileSync(
    `./src/modules/${moduleName}/${name.toLowerCase()}.controller.ts`,
    controller
  );
};
