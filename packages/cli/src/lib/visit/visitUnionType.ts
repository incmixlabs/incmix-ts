import ts, { UnionTypeNode } from "typescript";

import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitUnionType: Visiter<UnionTypeNode> = ({
  node,
  metadata,
  deps,
}) => {
  return ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("union")
      ),
      ts.factory.createPropertyAssignment(
        "members",
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
