import chalk from "chalk";
import { Command } from "commander";
import fs from "fs";
import inquirer from "inquirer";

export const makeRepositoryCommand = new Command("make:repo")
  .description("Create a new repository")
  .action(async () => {
    const { name } = await inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "Enter repository name:",
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
      // generate repository file dynamically
      await makeRepository(name, moduleName);
      console.log(
        chalk.green(`Repository ${name} created successfully in ${moduleName}`)
      );
    } catch (error) {
      console.error(chalk.red((error as any).message));
    }
  });

export const makeRepository = async (
  name: string,
  moduleName: string = name
) => {
  const data = fs.readFileSync("./src/baseFiles/user.repository.ts", "utf-8");
  const repository = data
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

  //   check if repository file already exists
  if (
    fs.existsSync(
      `./src/modules/${moduleName}/${name.toLowerCase()}.repository.ts`
    )
  ) {
    throw new Error("Repository already exists", { cause: "Exist" });
  }

  fs.writeFileSync(
    `./src/modules/${moduleName}/${name.toLowerCase()}.repository.ts`,
    repository
  );
};
