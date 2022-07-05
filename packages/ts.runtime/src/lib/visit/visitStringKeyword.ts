import ts from "typescript";

export const visitStringKeyword = (node: ts.Node) => {
  return ts.factory.createObjectLiteralExpression([
    ts.factory.createPropertyAssignment(
      "type",
      ts.factory.createStringLiteral("string")
    ),
  ]);
};
