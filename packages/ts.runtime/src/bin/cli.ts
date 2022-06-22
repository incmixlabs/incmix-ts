#!/usr/bin/env node

import { program } from "commander";
import { transform } from "./../transform";

function cli() {
  // get version
  program
    .name("ts.runtime")
    .description('CLI to generate ".ts.runtime" files from ".ts" files.')
    .version(require("../../package.json").version);

  // read the command line arguments
  const files = process.argv.slice(2);
  const codeTransform = transform(files[0]);
  console.log(codeTransform);
}

cli();
