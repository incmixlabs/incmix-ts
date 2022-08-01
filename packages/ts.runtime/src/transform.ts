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
  //   console.log(`file name: ${sourceFile.fileName}`);
  //   ts.forEachChild(sourceFile, (node: ts.Node) => {
  //     if (ts.isTypeAliasDeclaration(node)) {
  //       console.log(ts.SyntaxKind[node.kind]);
  //       console.log(ts.SyntaxKind[node.type.kind]);
  //       console.log(ts.TypeFlags[checker.getTypeAtLocation(node.type).flags]);
  //       // const resolved = checker.typeToTypeNode(checker.getTypeAtLocation(node.type), undefined, undefined)!;
  //       //
  //       // console.log(ts.SyntaxKind[resolved.kind]);
  //       const t = checker.getTypeAtLocation(node.type) as ts.IntersectionType;
  //       // t.types.forEach(_ => console.log(checker.symbolToExpression(_.symbol, _.symbol.flags, undefined, undefined)));
  //       // t.types.forEach(_ => console.log(ts.TypeFlags[_.flags], _.isClassOrInterface()));
  //       // const nodes = t.types.map(_ => checker.symbolToExpression(_.symbol, ts.SymbolFlags.Interface, undefined, undefined));
  //       // t.types.forEach(_ => _.symbol.members!.forEach((v, k) => console.log(v.valueDeclaration!.parent)));
  //       // t.types.forEach(_ => console.log(_.symbol.declarations![0] as ts.InterfaceDeclaration));
  //       // t.types.forEach(_ => console.log(_.symbol.declarations));
  //       // const nodes = t.types.map(_ => checker.typeToTypeNode(_, undefined, undefined)!);
  //       // nodes.forEach(_ => console.log(ts.TypeFlags[checker.getTypeAtLocation(_).flags])); // Any
  //       // nodes.forEach(_ => console.log(checker.getTypeAtLocation(_)));
  //       // t.types.forEach(_ => console.log(ts.TypeFlags[_.flags], ts.ObjectFlags[(_ as ts.ObjectType).objectFlags]));
  //       // const temp = t.types[0].symbol.declarations!;
  //       // console.log(temp.length, temp);
  //
  //       // nodes.map(_ => checker.getTypeAtLocation(_)).forEach(_ => console.log(ts.TypeFlags[_.flags], _.isClassOrInterface()));
  //       // nodes.map(_ => _.typeName).forEach(_ => console.log(_, ts.SyntaxKind[_.kind]));
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
