import chalk from "chalk";
import { execSync } from "child_process";
import { Command } from "commander";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";

function checkIfPnpmExist(): boolean {
  try {
    execSync("pnpm -V", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

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
      console.log(
        chalk.green(`Generating required folders and files to work on`)
      );
      const appSrc = path.resolve(__dirname, "../app");

      const cwd = process.cwd();
      const targetDir = name !== "." ? path.join(cwd, name) : cwd;

      copyDir(appSrc, targetDir);

      console.log(
        chalk.green(
          `Framework folders and file generate to ${targetDir} directory`
        )
      );

      if (!checkIfPnpmExist) {
        console.error(
          chalk.red(
            "❌ pnpm is not installed. Please install it and try again."
          )
        );

        const { isConfirm } = await inquirer.prompt([
          {
            name: "isConfirm",
            type: "confirm",
            message: "Do you want to install pnpm globally? ",
          },
        ]);

        if (!isConfirm) {
          console.log(
            chalk.red(
              "pnpm is required to continue process. Now do those steps manually!"
            )
          );
          process.exit(1);
        }

        console.log(chalk.yellow("Installing pnpm globally..."));
        execSync("npm install -g pnpm");
      }
      // Run setup commands
      console.log(chalk.yellow("Running setup commands..."));

      console.log(chalk.yellow("Installing required dependencies.."));
      execSync("pnpm install", { cwd: targetDir, stdio: "inherit" });

      console.log(
        chalk.yellow("Generating database sql from database schema..")
      );
      execSync("pnpm run db:generate", { cwd: targetDir, stdio: "inherit" });

      console.log(chalk.yellow("Migrating database sql to database.."));
      execSync("pnpm run db:migrate", { cwd: targetDir, stdio: "inherit" });

      console.log(chalk.green("✅ Project setup complete."));
    } catch (error) {
      console.error(chalk.red((error as any).message));
    }
  });
