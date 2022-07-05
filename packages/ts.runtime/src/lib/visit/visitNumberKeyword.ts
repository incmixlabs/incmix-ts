import ts from "typescript";

export const visitNumberKeyword =
  (context: ts.TransformationContext) => (node: ts.Node) => {
    return ts.factory.createObjectLiteralExpression([
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("number")
      ),
    ]);
  };
