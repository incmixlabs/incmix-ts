import ts from "typescript";

import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitArrayType: Visiter<ts.ArrayTypeNode> = ({
  node,
  metadata,
  deps,
}) => {
  return ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("array")
      ),
      ts.factory.createPropertyAssignment(
        "itemsAreReadOnly",
        ts.factory.createFalse()
      ),
      ts.factory.createPropertyAssignment(
        "items",
        visit({ node: node.elementType, deps: deps }) as ts.Expression
      ),
    ],
    true
  );
};
