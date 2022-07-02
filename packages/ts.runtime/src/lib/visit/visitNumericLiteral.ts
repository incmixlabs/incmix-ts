import ts from "typescript";

export const visitNumericLiteral =
  (context: ts.TransformationContext) => (node: ts.Node) => {
    return ts.factory.createObjectLiteralExpression(
      [
        ts.factory.createPropertyAssignment(
          "type",
          ts.factory.createStringLiteral("literal")
        ),
        ts.factory.createPropertyAssignment(
          "typeLiteral",
          ts.factory.createStringLiteral("number")
        ),
        ts.factory.createPropertyAssignment(
          "value",
          ts.factory.createNumericLiteral((node as ts.NumericLiteral).text)
        ),
      ],
      true
    );
  };
