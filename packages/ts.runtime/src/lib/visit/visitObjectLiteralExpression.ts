import ts from "typescript";

export const visitObjectLiteralExpression = (context: ts.TransformationContext) => (node: ts.ObjectLiteralExpression) => {
    return ts.factory.createObjectLiteralExpression(
        [
          ts.factory.createPropertyAssignment(
            "type",
            ts.factory.createStringLiteral("object")
          ),
          ts.factory.createPropertyAssignment(
            "properties",
            ts.factory.createObjectLiteralExpression()
          )
        ],
        true
      );
}