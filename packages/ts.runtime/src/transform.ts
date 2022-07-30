import * as ts from "typescript";
import fs from "fs";
import { visit } from "./lib/visit/visit";
import { FileIO } from "./FileIO";
import { Id } from "./Id";
import { Failable } from "./Failable";

var ctx: ts.TransformationContext;
const fileExt = ".ts";


export let checker: ts.TypeChecker;

export function transform(
  params: { filename: string; text: string; outputFilename: string },
  deps: { id: Id }
): Failable.Type<string> {
  // TODO ensure that the file's extension is .ts instead of .tsr (so just map .tsr to .ts)
  const program = ts.createProgram([params.filename], {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.None
  });
  checker = program.getTypeChecker();

  const sourceFile = program.getSourceFile(params.filename)!;
  // TODO remove below code
  // if (!sourceFile.isDeclarationFile) {
  //   console.log(sourceFile.fileName);
  //   ts.forEachChild(sourceFile, (node: ts.Node) => {
  //     if (ts.isTypeAliasDeclaration(node)) {
  //       console.log(ts.SyntaxKind[node.kind]);
  //       console.log(ts.SyntaxKind[node.type.kind]);
  //       console.log(ts.TypeFlags[checker.getTypeAtLocation(node.type).flags]);
  //       // const resolved = checker.typeToTypeNode(checker.getTypeAtLocation(node.type), undefined, undefined)!;
  //       //
  //       // console.log(ts.SyntaxKind[resolved.kind]);
  //       const t = checker.getTypeAtLocation(node.type) as ts.UnionType;
  //       t.types.forEach(_ => console.log(ts.SyntaxKind[checker.typeToTypeNode(_, undefined, undefined)!.kind]));
  //       // const n = checker.typeToTypeNode(t, undefined, undefined)!;
  //       // console.log(ts.SyntaxKind[n.kind]);
  //       // n.forEachChild(_ => console.log(ts.SyntaxKind[_.kind]));
  //
  //
  //       // t.types.forEach(_ => console.log(ts.TypeFlags[_.flags]));
  //       // console.log(checker.getWidenedType(t));
  //
  //       // console.log(checker.getTypeAtLocation(node.type).getProperties()[0].getDeclarations()!.map(_ => ts.SyntaxKind[_.kind]));
  //       // console.log(checker.getTypeAtLocation(node.type).aliasTypeArguments);
  //     }
  //   });
  // }
  // TODO remove above code

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
}

function createTsRuntimeFile(filename: string, text: string) {
  const file = filename + fileExt;

  fs.writeFileSync(file, text);
}
