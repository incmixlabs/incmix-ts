#!/usr/bin/env node

import { program, Command } from "commander";
import { args, Args } from "../Args";
import { Failable } from "../Failable";
import { fileIO, FileIO } from "../FileIO";
import { id } from "../Id";
import { transform } from "./../transform";

const program2 = new Command();
export function cli(params: { deps: { fileIO: FileIO; args: Args } }) {
  // get version
  program
    .name("ts.runtime")
    .description('CLI to generate ".ts.runtime" files from ".ts" files.')
    .version(require("../../package.json").version)
    .argument("<input-file>", "The path to the file to read")
    .option("-o --output [output]", "The path to the output file");

  program.parse(params.deps.args.getArgs(), {
    from: params.deps.args.startsOnActualArguments() ? "user" : "node",
  });

  const fileName = program.args[0];
  const options = program.opts();
  const outputFileName = options.output;


  const codeTransform = transform(
      {
          filename: fileName,
          outputFilename: outputFileName ?? "output-file-name.ts",
      },
      {
          id,
      }
  );

  if (outputFileName) {
    const fileWriteResult = Failable.run(codeTransform, (code) =>
      fileIO.write({
        filePath: outputFileName,
        text: code,
      })
    );

    Failable.runFailure(fileWriteResult, Failable.unwrapFailure);

    return;
  }

  const codeTransformSuccess = Failable.runFailure(
    codeTransform,
    Failable.unwrapFailure
  );

  console.log(`
Logging to console as you didn't provide an output file:

${codeTransformSuccess.value}
  `);
}

if (require.main) {
  cli({ deps: { fileIO, args } });
}
