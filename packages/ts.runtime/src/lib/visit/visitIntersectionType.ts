import ts from "typescript";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitIntersectionType: Visiter<ts.IntersectionTypeNode> = ({
  node,
  metadata,
  deps,
}) => {
  return ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("intersection")
      ),
      ts.factory.createPropertyAssignment(
        "values",
        ts.factory.createArrayLiteralExpression(
          mapNodeChildren(node, (n) =>
            visit({ node: n, deps })
          ) as ts.Expression[],
          true
        )
      ),
    ],
    true
  );
};
