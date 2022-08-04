import { cli } from "../cli";
import { args } from "../deps/Args";
import { commanderProgram } from "../deps/CommanderProgram";
import { fileOutput } from "../deps/FileOutput";
import { id } from "../deps/Id";
import { logger } from "../deps/Logger";

cli({ deps: { fileOutput: fileOutput, args, logger, commanderProgram, id } });
