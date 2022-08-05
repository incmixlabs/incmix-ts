import { args, fileOutput, id, logger } from "@tsr/core";

import { cli } from "../cli";
import { commanderProgram } from "../CommanderProgram";

cli({ deps: { fileOutput: fileOutput, args, logger, commanderProgram, id } });
