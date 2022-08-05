#!/usr/bin/env node

import { Args, Failable, FileOutput, Id, Logger, transform } from "@ts-r/core";
import { Command } from "commander";

import { CommanderProgram } from "./CommanderProgram";

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
  const outputFileName = fileName.replace(/\.tsr\.ts$/, ".tsr.o.ts");
  const prependTsCode = options.prepend;
  const codeTransform = transform(
    {
      filename: fileName,
      outputFilename: outputFileName,
      prependTsCode: !!prependTsCode,
    },
    {
      id: params.deps.id,
    }
  );

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
}
