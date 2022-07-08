import ts from "typescript";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitArrayType: Visiter<ts.ArrayTypeNode> = (node, metadata) => {
  return ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("array")
      ),
      ts.factory.createPropertyAssignment("items", visit(node.elementType) as ts.Expression),
    ],
    true
  );
};
