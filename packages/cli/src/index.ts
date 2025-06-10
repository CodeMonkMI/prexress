import { Command } from "commander";
import { initCommand } from "./commands/init.command";
import { makeControllerCommand } from "./commands/make-controller.command";
import { makeMiddlewareCommand } from "./commands/make-middleware.commands";
import { makeModuleCommand } from "./commands/make-module.command";
import { makeRepositoryCommand } from "./commands/make-repository.commands";
import { makeSchemaCommand } from "./commands/make-schema.commands";
import { makeServiceCommand } from "./commands/make-service.commands";

const program = new Command();

program.name("PXR Cli").description("A CLI for PXR framework").version("0.0.1");

program.addCommand(initCommand);
program.addCommand(makeControllerCommand);
program.addCommand(makeSchemaCommand);
program.addCommand(makeServiceCommand);
program.addCommand(makeRepositoryCommand);
program.addCommand(makeMiddlewareCommand);
program.addCommand(makeModuleCommand);

program.parse(process.argv);
