#!/usr/bin/env node

import { Command } from "commander";

import { Args } from "./deps/Args";
import { CommanderProgram } from "./deps/CommanderProgram";
import { FileOutput } from "./deps/FileOutput";
import { Id } from "./deps/Id";
import { Logger } from "./deps/Logger";
import { Failable } from "./Failable";
import { transform } from "./transform";

export const program = new Command();

export function cli(params: {
  deps: {
    fileOutput: FileOutput;
    args: Args;
    logger: Logger;
    commanderProgram: CommanderProgram;
    id: Id;
  };
}) {
  let exit = false;
  // get version
  const program = new Command();
  program.exitOverride();
  program
    .name("ts.runtime")
    .description('CLI to generate ".ts.runtime" files from ".ts" files.')
    .version("0.0.0")
    .argument("<input-file>", "The path to the file to read")
    .option("-o --output [output]", "The path to the output file")
    .option(
      "-p --prepend",
      "Prepend all statements (excluding imports) from .tsr into output file"
    )
    .configureOutput({
      writeOut(str) {
        params.deps.logger.log(str);
      },
      writeErr(str) {
        params.deps.logger.error(str);
      },
    });

  try {
    if (params.deps.args.startsOnActualArguments) {
      program.parse(params.deps.args.getArgs(), {
        from: "user",
      });
    } else {
      program.parse(params.deps.args.getArgs());
    }
  } catch (e: any) {
    exit = true;
    params.deps.commanderProgram.exitOverride(e);
  }

  if (exit) {
    return;
  }
  const fileName = program.args[0];
  const options = program.opts();
  const outputFileName = options.output;
  const prependTsCode = options.prepend;
  const codeTransform = transform(
    {
      filename: fileName,
      outputFilename: outputFileName ?? "output-file-name.ts",
      prependTsCode: !!prependTsCode,
    },
    {
      id: params.deps.id,
    }
  );

  if (outputFileName) {
    const fileWriteResult = Failable.run(codeTransform, (code) =>
      params.deps.fileOutput.write({
        filePath: outputFileName,
        text: code,
      })
    );

    Failable.runFailure<void, Failable.Type<void>>(fileWriteResult, (err) => {
      params.deps.logger.error(`${err.msg}`);
      return err;
    });

    return;
  }

  if (codeTransform.type === "failure") {
    params.deps.logger.error(`${codeTransform.msg}`);
    return;
  }

  console.log(`
Logging to console as you didn't provide an output file:

${codeTransform.value}
  `);
}
