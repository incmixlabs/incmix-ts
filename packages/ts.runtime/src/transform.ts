import * as ts from "typescript";
import fs from "fs";
import { visit } from "./lib/visit/visit";
import { FileIO } from "./deps/FileIO";
import { Id } from "./deps/Id";
import { Failable } from "./Failable";

var ctx: ts.TransformationContext;
const fileExt = ".ts";

export function transform(
  params: { filename: string; text: string; outputFilename: string },
  deps: { id: Id }
): Failable.Type<string> {
  try {
    const sourceFile = ts.createSourceFile(
      params.filename,
      params.text,
      ts.ScriptTarget.Latest
    );

    const resultFile = ts.createSourceFile(
      params.outputFilename,
      "",
      ts.ScriptTarget.Latest,
      /*setParentNodes*/ false,
      ts.ScriptKind.TS
    );

    const transformResult = visit({ deps, node: sourceFile });
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const text = printer.printNode(
      ts.EmitHint.Unspecified,
      transformResult,
      resultFile
    );

    return Failable.success(text);
  } catch (e: any) {
    return Failable.failure(e?.message ? e.message : e);
  }
}

function createTsRuntimeFile(filename: string, text: string) {
  const file = filename + fileExt;

  fs.writeFileSync(file, text);
}
