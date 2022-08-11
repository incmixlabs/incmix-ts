import { args, fileOutput, id, logger } from "@ts-r/core";

import { cli } from "../cli";
import { commanderProgram } from "../CommanderProgram";

cli({ deps: { fileOutput: fileOutput, args, logger, commanderProgram, id } });
