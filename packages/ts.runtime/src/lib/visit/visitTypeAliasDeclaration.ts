import ts, { Expression } from "typescript";
import { visit } from "./visit";

export const visitTypeAliasDeclaration = (node: ts.TypeAliasDeclaration) => {
  console.log("Found TypeKeyword");

  let identifier: ts.Identifier = undefined!;
  let expression: ts.Node = undefined!;

  let index = 0;
  node.forEachChild((cNode) => {
    if (cNode.kind === ts.SyntaxKind.Identifier) {
      identifier = cNode as ts.Identifier;
    }
    if (index === 2) {
      expression = cNode;
    }
    index++;
  });

  if (identifier && expression) {
    console.log(expression.kind);
    const variableDeclarationList = ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier(identifier.text + `_$TSR`),
          undefined,
          undefined,

          visit(expression) as Expression
        ),
      ],
      ts.NodeFlags.Const
    );

    return ts.factory.createVariableStatement(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      variableDeclarationList
    );
  }

  throw new Error("Can't find Identifier or Expression");
};
