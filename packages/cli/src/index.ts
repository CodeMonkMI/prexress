import { Command } from "commander";
import { makeControllerCommand } from "./commands/make-controller.command";
import { makeMiddlewareCommand } from "./commands/make-middleware.commands";
import { makeModuleCommand } from "./commands/make-module.command";
import { makeRepositoryCommand } from "./commands/make-repository.commands";
import { makeSchemaCommand } from "./commands/make-schema.commands";
import { makeServiceCommand } from "./commands/make-service.commands";

const program = new Command();

program.name("PXR Cli").description("A CLI for PXR framework").version("0.0.1");

program.command("init").description("Initialize a new PXR project");

program.addCommand(makeControllerCommand);
program.addCommand(makeSchemaCommand);
program.addCommand(makeServiceCommand);
program.addCommand(makeRepositoryCommand);
program.addCommand(makeMiddlewareCommand);
program.addCommand(makeModuleCommand);

program.parse(process.argv);
