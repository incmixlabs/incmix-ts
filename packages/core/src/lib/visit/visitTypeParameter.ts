import ts from "typescript";

import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitTypeParameter: Visiter<ts.TypeParameterDeclaration> = ({
  node,
  deps,
}) => {
  return ts.factory.createObjectLiteralExpression(
    [
      ts.factory.createPropertyAssignment(
        "name",
        ts.factory.createStringLiteral(node.name.text)
      ),
      ts.factory.createPropertyAssignment(
        "extends",
        visit({
          node:
            node.constraint ??
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
          deps,
        }) as ts.Expression
      ),
    ],
    true
  );
};
