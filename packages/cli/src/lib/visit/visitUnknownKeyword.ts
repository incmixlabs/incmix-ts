import ts from "typescript";
import { Visiter } from "../helpers/types";

export const visitUnknownKeyword: Visiter = (params) => {
  return ts.factory.createObjectLiteralExpression([
    ...(params.metadata ?? []),
    ts.factory.createPropertyAssignment(
      "type",
      ts.factory.createStringLiteral("unknown")
    ),
  ]);
};
