import ts, { ObjectLiteralElementLike } from "typescript";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { visit } from "./visit";

export const visitTypeLiteral =
  (context: ts.TransformationContext) => (node: ts.TypeLiteralNode) => {
    return ts.factory.createObjectLiteralExpression(
      [
        ts.factory.createPropertyAssignment(
          "type",
          ts.factory.createStringLiteral("object")
        ),
        ts.factory.createPropertyAssignment(
          "properties",
          ts.factory.createObjectLiteralExpression(
            mapNodeChildren(node, visit(context)) as ObjectLiteralElementLike[],
            true
          )
        ),
      ],
      true
    );
  };
