import ts from "typescript";
import { Visiter } from "../helpers/types";

export const visitNumericLiteral: Visiter = (node, metadata) => {
  return ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("literal")
      ),
      ts.factory.createPropertyAssignment(
        "typeLiteral",
        ts.factory.createStringLiteral("number")
      ),
      ts.factory.createPropertyAssignment(
        "value",
        ts.factory.createNumericLiteral((node as ts.NumericLiteral).text)
      ),
    ],
    true
  );
};
