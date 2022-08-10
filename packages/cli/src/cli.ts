#!/usr/bin/env node

import { Args, Failable, FileOutput, Id, Logger, transform } from "@ts-r/core";
import { Command } from "commander";
import fs from "fs";
import path from "path";

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
    .configureOutput({
      writeOut(str) {
        params.deps.logger.log(str);
      },
      writeErr(str) {
        params.deps.logger.error(str);
      },
    })
    .option(
      "-w --watch",
      "Watch the files and re-generate them when they change"
    );

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

  if (!fs.existsSync(fileName)) {
    // TODO:
    return;
  }

  handleFile({
    deps: params.deps,
    fileName,
  });
}

const handleFile = (params: {
  fileName: string;
  deps: {
    fileOutput: FileOutput;
    args: Args;
    logger: Logger;
    commanderProgram: CommanderProgram;
    id: Id;
  };
}) => {
  const isFolder = fs.lstatSync(params.fileName).isDirectory();

  if (isFolder) {
    const children = fs.readdirSync(params.fileName);
    for (const child of children) {
      handleFile({
        fileName: path.join(params.fileName, child),
        deps: params.deps,
      });
    }
    return;
  }

  if (!params.fileName.endsWith(".tsr.ts")) return;
  const outputFileName = params.fileName.replace(/\.tsr\.ts$/, ".tsr.o.ts");
  const codeTransform = transform(
    {
      filename: params.fileName,
      outputFilename: outputFileName,
      prependTsCode: false,
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
};
