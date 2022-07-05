import ts from "typescript";

export const visitUnknownKeyword = (node: ts.Node) => {
  return ts.factory.createObjectLiteralExpression([
    ts.factory.createPropertyAssignment(
      "type",
      ts.factory.createStringLiteral("unknown")
    ),
  ]);
};
