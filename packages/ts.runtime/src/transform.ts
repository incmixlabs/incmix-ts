import * as ts from "typescript";
import fs from "fs";
import { visit } from "./lib/visit/visit";

var ctx: ts.TransformationContext;
const fileExt = ".ts";

export function transform(filename: string): string {
  // const program = ts.createProgram([filename], {});
  // const sourceFile = program.getSourceFile(filename)!;
  const code = fs.readFileSync(filename, "utf8");
  const sourceFile = ts.createSourceFile(
    filename,
    code,
    ts.ScriptTarget.Latest
  );

  return printNode(
    sourceFile,
    filename
  );
}

export function transformFromSource(source: string, fileName = "") {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest
  );
  return printNode(
    sourceFile,
    fileName,
    false
  );
}

function printNode(
  sourceFile: ts.SourceFile,
  filename: string,
  canWriteFile: boolean = true
) {
  const transformResult = visit(sourceFile);

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const resultFile = ts.createSourceFile(
    "someFileName.ts",
    "",
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS
  );

  const text = printer.printNode(
    ts.EmitHint.Unspecified,
    transformResult,
    resultFile
  );

  canWriteFile && createTsRuntimeFile(filename, text);

  return text;
}

function createTsRuntimeFile(filename: string, text: string) {
  const file = filename + fileExt;

  fs.writeFileSync(file, text);
}
