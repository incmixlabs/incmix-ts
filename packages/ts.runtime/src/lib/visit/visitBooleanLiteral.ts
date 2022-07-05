import ts from "typescript";

export const visitBooleanLiteral =
  (node: ts.Node): ts.Node => {
    return ts.factory.createObjectLiteralExpression(
      [
        ts.factory.createPropertyAssignment(
          "type",
          ts.factory.createStringLiteral("literal")
        ),
        ts.factory.createPropertyAssignment(
          "typeLiteral",
          ts.factory.createStringLiteral("boolean")
        ),
        ts.factory.createPropertyAssignment(
          "value",
          node.kind === ts.SyntaxKind.TrueKeyword
            ? ts.factory.createTrue()
            : ts.factory.createFalse()
        ),
      ],
      true
    );
  };
