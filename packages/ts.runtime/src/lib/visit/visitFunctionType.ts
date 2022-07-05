import ts, { Expression } from "typescript";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { visit } from "./visit";

export const visitFunctionType = (node: ts.FunctionTypeNode) => {
  const children = mapNodeChildren(node, (n) => n);
  return ts.factory.createObjectLiteralExpression(
    [
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("function")
      ),
      ts.factory.createPropertyAssignment(
        "parameters",
        ts.factory.createArrayLiteralExpression(
          node.parameters.map(visit) as Expression[],
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
