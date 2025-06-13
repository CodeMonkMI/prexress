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

function checkIfDockerExists(): boolean {
  try {
    execSync("docker --version", { stdio: "ignore" });
    return true;
  } catch {
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
        message: "Enter the name of the project: ",
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

      // 🔁 Copy .env.example -> .env if applicable
      console.log(chalk.yellow("Generating environment file.."));
      const envExamplePath = path.join(targetDir, ".env.example");
      const envTargetPath = path.join(targetDir, ".env");
      fs.copyFileSync(envExamplePath, envTargetPath);
      console.log(chalk.green(".env file generated"));

      console.log(
        chalk.yellow("Generating database sql from database schema..")
      );
      execSync("pnpm run db:generate", { cwd: targetDir, stdio: "inherit" });

      // 🐳 Check for Docker and handle DB migration accordingly
      if (!checkIfDockerExists()) {
        console.warn(
          chalk.red("⚠️ Docker is not installed or not available in PATH.")
        );
        console.log(chalk.yellow("Database migration step was skipped."));
        console.log(
          chalk.yellow("You can use docker or install postgressql database")
        );

        console.log(chalk.yellow("For docker use following steps:"));
        console.log(chalk.yellow("To enable database setup, please:"));
        console.log(
          "1. Install Docker: " +
            chalk.cyan("https://www.docker.com/products/docker-desktop")
        );
        console.log(`2. Run the following commands manually:`);

        console.log(chalk.blue("   docker compose up -d"));

        console.log(chalk.yellow("For local postgresql:"));
        console.log(chalk.yellow("1. Install postgressql database."));
        console.log(chalk.yellow("2. Setup .env file's environment"));

        console.log(`Now run the following commands manually:`);
        console.log(chalk.blue("   pnpm run db:migrate"));
        process.exit(1);
      }

      execSync("docker compose up -d", { cwd: targetDir, stdio: "inherit" });
      console.log(chalk.yellow("Running Docker containers..."));
      setTimeout(() => {
        console.log(chalk.yellow("Running database migration..."));
        execSync("pnpm run db:migrate", { cwd: targetDir, stdio: "inherit" });

        console.log(chalk.green("✅ DB migration completed."));

        console.log(chalk.yellow("Migrating database sql to database.."));
        execSync("pnpm run db:migrate", { cwd: targetDir, stdio: "inherit" });

        console.log(chalk.green("✅ Project setup complete."));
      }, 3000);
    } catch (error) {
      console.error(chalk.red((error as any).message));
    }
  });
