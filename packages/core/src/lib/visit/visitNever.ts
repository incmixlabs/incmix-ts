import ts from "typescript";

import { Visiter } from "../helpers/types";

export const visitNever: Visiter<ts.KeywordTypeNode> = () =>
  ts.factory.createObjectLiteralExpression([
    ts.factory.createPropertyAssignment(
      "type",
      ts.factory.createStringLiteral("never")
    ),
  ]);
