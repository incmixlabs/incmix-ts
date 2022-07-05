import ts, { Expression, FunctionTypeNode } from "typescript";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitFunctionType: Visiter<FunctionTypeNode> = (
  node,
  metadata
) => {
  const children = mapNodeChildren(node, (n) => n);
  return ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("function")
      ),
      ts.factory.createPropertyAssignment(
        "parameters",
        ts.factory.createArrayLiteralExpression(
          node.parameters.map((n) => visit(n)) as Expression[],
          true
        )
      ),
      ts.factory.createPropertyAssignment(
        "returns",
        visit(children.at(-1)!) as Expression
      ),
    ],
    true
  );
};
