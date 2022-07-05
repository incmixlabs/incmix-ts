import ts, { UnionTypeNode } from "typescript";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitUnionType: Visiter<UnionTypeNode> = (node, metadata) => {
  return ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("union")
      ),
      ts.factory.createPropertyAssignment(
        "values",
        ts.factory.createArrayLiteralExpression(
          mapNodeChildren(node, visit) as ts.Expression[],
          true
        )
      ),
    ],
    true
  );
};
