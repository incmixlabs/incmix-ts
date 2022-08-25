import ts from "typescript";

import { Visiter } from "../helpers/types";

export const visitBigInt: Visiter<ts.BigIntLiteral> = ({ node, metadata }) =>
  ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("literal")
      ),
      ts.factory.createPropertyAssignment(
        "typeLiteral",
        ts.factory.createStringLiteral("bigint")
      ),
      ts.factory.createPropertyAssignment(
        "value",
        ts.factory.createBigIntLiteral(node.text)
      ),
    ],
    true
  );
