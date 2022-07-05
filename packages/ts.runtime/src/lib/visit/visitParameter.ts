import ts from "typescript";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { visit } from "./visit";

export const visitParameter = (node: ts.ParameterDeclaration) => {
  const children = mapNodeChildren(node, (n) => n);
  const spread = children.some((n) => n.kind === ts.SyntaxKind.DotDotDotToken);

  return ts.factory.createObjectLiteralExpression(
    [
      ts.factory.createPropertyAssignment(
        "spread",
        spread ? ts.factory.createTrue() : ts.factory.createFalse()
      ),
      ts.factory.createPropertyAssignment(
        "tsRuntimeObject",
        visit(
          node.type ??
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
        ) as ts.Expression
      ),
    ],
    true
  );
};
