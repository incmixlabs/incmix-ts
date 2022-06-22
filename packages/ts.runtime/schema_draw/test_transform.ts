import * as ts from "typescript";

export function transform(filename: string): string {
  const program = ts.createProgram([filename], {});
  const sourceFile = program.getSourceFile(filename)!;
  const typeChecker = program.getTypeChecker();
  const transformerFactory: ts.TransformerFactory<ts.Node> = (
    context: ts.TransformationContext
  ) => {
    return (rootNode) => {
      function visit(node: ts.Node): ts.Node {
        console.log(node.kind);
        if (ts.isTypeReferenceNode(node)) {
          const type = typeChecker.getTypeFromTypeNode(node);
          const typeName = typeChecker.typeToString(type);
          if (type.isStringLiteral()) {
            ts.addSyntheticTrailingComment(
              node,
              ts.SyntaxKind.SingleLineCommentTrivia,
              typeName
            );
          }
        }
        return ts.visitEachChild(node, visit, context);
      }
      return ts.visitNode(rootNode, visit);
    };
  };

  const transformationResult = ts.transform(sourceFile, [transformerFactory]);
  const transformedSourceFile = transformationResult.transformed[0];
  const printer = ts.createPrinter();

  const code = printer.printNode(
    ts.EmitHint.Unspecified,
    transformedSourceFile,
    sourceFile
  );
  return code;
}

type Cat = {
  fur: boolean;
};

type Animal = {
  name: string;
};

type Bear = Animal &
  Cat & {
    honey: boolean;
  };
