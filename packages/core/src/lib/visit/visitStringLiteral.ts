import ts from "typescript";

import { Visiter } from "../helpers/types";

export const visitStringLiteral: Visiter = ({ node, metadata }) => {
  return ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("literal")
      ),
      ts.factory.createPropertyAssignment(
        "typeLiteral",
        ts.factory.createStringLiteral("string")
      ),
      ts.factory.createPropertyAssignment(
        "value",
        ts.factory.createStringLiteral((node as ts.StringLiteral).text)
      ),
    ],
    true
  );
};
