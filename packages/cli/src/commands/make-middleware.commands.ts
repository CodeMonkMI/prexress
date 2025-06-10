import chalk from "chalk";
import { Command } from "commander";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";

export const makeMiddlewareCommand = new Command("make:middleware")
  .description("Create a new middleware")
  .action(async () => {
    const { name } = await inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "Enter middleware name:",
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
    // generate middleware file dynamically

    try {
      await makeMiddleware(name, moduleName);
      console.log(chalk.green(`Middleware ${name} created successfully!`));
    } catch (error) {
      console.error(chalk.red((error as any).message));
    }
  });

export const makeMiddleware = async (
  name: string,
  moduleName: string = name
) => {
  const pathName = path.resolve(__dirname, "../baseFiles/user.middleware.ts");
  const data = fs.readFileSync(pathName, "utf-8");
  const middleware = data
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

  //   check if middleware file already exists
  if (
    fs.existsSync(
      `./src/modules/${moduleName}/${name.toLowerCase()}.middleware.ts`
    )
  ) {
    throw new Error("Middleware already exists", { cause: "Exist" });
  }

  fs.writeFileSync(
    `./src/modules/${moduleName}/${name.toLowerCase()}.middleware.ts`,
    middleware
  );
};
