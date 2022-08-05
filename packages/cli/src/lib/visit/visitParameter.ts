import ts from "typescript";

import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitParameter: Visiter<ts.ParameterDeclaration> = ({
  node,
  metadata,
  deps,
}) => {
  const spread = !!node.dotDotDotToken;
  const optional = !!node.questionToken;

  return ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      ts.factory.createPropertyAssignment(
        "spread",
        spread ? ts.factory.createTrue() : ts.factory.createFalse()
      ),
      ts.factory.createPropertyAssignment(
        "optional",
        optional ? ts.factory.createTrue() : ts.factory.createFalse()
      ),
      ts.factory.createPropertyAssignment(
        "tsRuntimeObject",
        visit({
          node:
            node.type ??
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
          deps,
        }) as ts.Expression
      ),
    ],
    true
  );
};
