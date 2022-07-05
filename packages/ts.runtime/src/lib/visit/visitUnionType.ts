import ts from "typescript";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { visit } from "./visit";

export const visitUnionType = (node: ts.UnionTypeNode) => {
  return ts.factory.createObjectLiteralExpression(
    [
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
