import ts from "typescript";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitTypeParameter: Visiter<ts.TypeParameterDeclaration> = (
  node,
  metadata
) => {
  return ts.factory.createObjectLiteralExpression(
    [
      ts.factory.createPropertyAssignment(
        "name",
        ts.factory.createStringLiteral(node.name.text)
      ),
      ts.factory.createPropertyAssignment(
        "extends",
        visit(
          node.constraint ??
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
        ) as ts.Expression
      ),
    ],
    true
  );
};
