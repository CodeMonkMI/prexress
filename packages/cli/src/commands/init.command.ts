import chalk from "chalk";
import { Command } from "commander";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";

export const initCommand = new Command("init")
  .description("Initialize a new @prexress/framework project")
  .action(async () => {
    const { name } = await inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "Enter the name of you project: ",
        validate(input: string) {
          if (!input) {
            return "Please enter a valid name";
          }
          return true;
        },
      },
    ]);

    function copyDir(src: string, dest: string) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }

    try {
      const appSrc = path.resolve(__dirname, "../app");
      const cwd = process.cwd();
      if (name === ".") {
        copyDir(appSrc, cwd);
        console.log(chalk.green("All app files copied to current directory."));
      } else {
        const targetDir = path.join(cwd, name);
        copyDir(appSrc, targetDir);
        console.log(chalk.green(`App files copied to ${targetDir}`));
      }
    } catch (error) {
      console.error(chalk.red((error as any).message));
    }
  });
