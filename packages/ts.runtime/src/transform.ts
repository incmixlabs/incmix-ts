import * as ts from "typescript";
import fs from "fs";
import { visit } from "./lib/visit/visit";
import { FileIO } from "./FileIO";
import { Id } from "./Id";
import { Failable } from "./Failable";

var ctx: ts.TransformationContext;
const fileExt = ".ts";

function removeMe(fileName: string) {
  // TODO ensure that the file's extension is .ts instead of .tsr (so just map .tsr to .ts)
  const options = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.None
  } as const;
  const program = ts.createProgram([fileName], options);
    // Get the checker, we will use it to find more about classes
  let checker = program.getTypeChecker();

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree to search for classes
      ts.forEachChild(sourceFile, visit);
    }
  }

  /** visit nodes finding exported classes */
  function visit(node: ts.Node) {
    console.log(ts.SyntaxKind[node.kind]);

    // TODO use getFlags() to obtain the node's type
    console.log(ts.TypeFlags[checker.getTypeAtLocation(node).getFlags()]);
    // console.log(node);
    // checker.getTypeAtLocation(node).getApparentProperties().forEach(_ => {
    //   console.log(_);
    // });
    // console.log(checker.getSymbolAtLocation(node));
    // checker.getAliasedSymbol(check);
  }
}

export function transform(
  params: { filename: string; text: string; outputFilename: string },
  deps: { id: Id }
): Failable.Type<string> {
  removeMe(params.filename);
  // const sourceFile = ts.createSourceFile(
  //   params.filename,
  //   params.text,
  //   ts.ScriptTarget.Latest
  // );
  //
  // const resultFile = ts.createSourceFile(
  //   params.outputFilename,
  //   "",
  //   ts.ScriptTarget.Latest,
  //   /*setParentNodes*/ false,
  //   ts.ScriptKind.TS
  // );
  //
  // const transformResult = visit({ deps, node: sourceFile });
  // const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  // const text = printer.printNode(
  //   ts.EmitHint.Unspecified,
  //   transformResult,
  //   resultFile
  // );

  return Failable.success("");
}

function createTsRuntimeFile(filename: string, text: string) {
  const file = filename + fileExt;

  fs.writeFileSync(file, text);
}
