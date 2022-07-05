import ts, { ObjectLiteralElementLike } from "typescript";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { visit } from "./visit";

export const visitTypeLiteral = (node: ts.TypeLiteralNode) => {
  return ts.factory.createObjectLiteralExpression(
    [
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("object")
      ),
      ts.factory.createPropertyAssignment(
        "properties",
        ts.factory.createObjectLiteralExpression(
          mapNodeChildren(node, visit) as ObjectLiteralElementLike[],
          true
        )
      ),
    ],
    true
  );
};
