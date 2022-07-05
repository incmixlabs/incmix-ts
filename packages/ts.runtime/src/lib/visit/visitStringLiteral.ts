import ts from "typescript";

export const visitStringLiteral = (node: ts.Node) => {
  return ts.factory.createObjectLiteralExpression(
    [
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
