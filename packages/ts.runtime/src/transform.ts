import * as ts from "typescript";
import fs from "fs";
import { visit } from "./lib/visit/visit";
import { FileIO } from "./FileIO";
import { Id } from "./Id";
import { Failable } from "./Failable";
import {SourceFile} from "typescript";

var ctx: ts.TransformationContext;
const fileExt = ".ts";

function printRecursiveFrom(
    node: ts.Node, indentLevel: number
) {
  const indentation = "-".repeat(indentLevel);
  const syntaxKind = ts.SyntaxKind[node.kind];
  // const nodeText = node.getText(sourceFile);
  console.log(`${indentation}${syntaxKind}`);

  node.forEachChild(child =>
      printRecursiveFrom(child, indentLevel + 1)
  );
}

function insertTSRCode(transformResult: ts.SourceFile, sourceFile: ts.SourceFile) {
  // Walk through source file until you get past the import statements
  sourceFile.statements.forEach(_ => {
    console.log(ts.SyntaxKind[_.kind]);
  });

  // Find the index at which the source file's code should be inserted into the transformed file
  const index = sourceFile.statements.findIndex(node =>
     node.kind !== ts.SyntaxKind.ImportDeclaration
  );
  console.log(index); // TODO REMOVE ME

  // Nothing is to be done if the file contains only import statements, so return
  if (index === -1) return;


  // TODO Filter out all nodes from the source file which will have been transformed
  // TODO Insert those nodes at the above specified index into the transform result file

}

export function transform(
  params: { filename: string; text: string; outputFilename: string },
  deps: { id: Id }
): Failable.Type<string> {
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
  insertTSRCode(transformResult as SourceFile, sourceFile); // TODO not functional as of yet (REMOVE ME when functional)
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const text = printer.printNode(
    ts.EmitHint.Unspecified,
    transformResult,
    resultFile
  );

  return Failable.success(text);
}

function createTsRuntimeFile(filename: string, text: string) {
  const file = filename + fileExt;

  fs.writeFileSync(file, text);
}
