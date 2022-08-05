import ts from "typescript";

import { Visiter } from "../helpers/types";

export const visitBooleanKeyword: Visiter = ({ metadata }) => {
  return ts.factory.createObjectLiteralExpression([
    ...(metadata ?? []),
    ts.factory.createPropertyAssignment(
      "type",
      ts.factory.createStringLiteral("boolean")
    ),
  ]);
};
