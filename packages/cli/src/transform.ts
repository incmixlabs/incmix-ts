import * as ts from "typescript";

import { Id } from "./deps/Id";
import { Failable } from "./Failable";
import { visit } from "./lib/visit/visit";

function insertTSRCode(
  transformResult: ts.SourceFile,
  sourceFile: ts.SourceFile
): ts.Statement[] {
  // Find the index at which the source file's code should be inserted into the transformed file
  const index = sourceFile.statements.findIndex(
    (node) => node.kind !== ts.SyntaxKind.ImportDeclaration
  );

  // Nothing is to be done if the file contains only import statements, so return
  if (index === -1) return [...transformResult.statements];

  // Filter out import statements from source file
  const sourceCode = sourceFile.statements.filter(
    (node) => node.kind !== ts.SyntaxKind.ImportDeclaration
  );

  // Insert those nodes at the above specified index into the transform result file
  return [
    ...transformResult.statements.slice(0, index),
    ...sourceCode,
    ...transformResult.statements.slice(index),
  ];
}

export let checker: ts.TypeChecker;

export function transform(
  params: { filename: string; outputFilename: string; prependTsCode: boolean },
  deps: { id: Id }
): Failable.Type<string> {
  try {
    const program = ts.createProgram([params.filename], {
      target: ts.ScriptTarget.Latest,
      module: ts.ModuleKind.None,
    });
    checker = program.getTypeChecker();

    const sourceFile = program.getSourceFile(params.filename)!;
    const resultFile = ts.createSourceFile(
      params.outputFilename,
      "",
      ts.ScriptTarget.Latest,
      /*setParentNodes*/ false,
      ts.ScriptKind.TS
    );

    const transformResult = visit({ deps, node: sourceFile }) as ts.SourceFile;
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const text = params.prependTsCode
      ? insertTSRCode(transformResult as ts.SourceFile, sourceFile)
          .map(
            (node) =>
              printer.printNode(ts.EmitHint.Unspecified, node, sourceFile) +
              "\n"
          )
          .reduce((acc, val) => (acc += val))
      : printer.printNode(ts.EmitHint.Unspecified, transformResult, resultFile);

    return Failable.success(text);
  } catch (e: any) {
    return Failable.failure(e?.message ? e.message : e);
  }
}
