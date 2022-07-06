import ts from "typescript";
import { Visiter } from "../helpers/types";

export const visitBooleanLiteral: Visiter = (node, metadata) => {
  return ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("literal")
      ),
      ts.factory.createPropertyAssignment(
        "typeLiteral",
        ts.factory.createStringLiteral("boolean")
      ),
      ts.factory.createPropertyAssignment(
        "value",
        node.kind === ts.SyntaxKind.TrueKeyword
          ? ts.factory.createTrue()
          : ts.factory.createFalse()
      ),
    ],
    true
  );
};
