import { cli } from "../cli";
import { args } from "../deps/Args";
import { commanderProgram } from "../deps/CommanderProgram";
import { fileIO } from "../deps/FileIO";
import { logger } from "../deps/Logger";

cli({ deps: { fileIO, args, logger, commanderProgram } });
