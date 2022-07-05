import ts from "typescript";

export const visitBooleanKeyword = (node: ts.Node) => {
    return ts.factory.createObjectLiteralExpression([
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("boolean")
      ),
    ]);
  };
