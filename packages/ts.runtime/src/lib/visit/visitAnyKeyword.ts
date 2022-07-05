import ts from "typescript";

export const visitAnyKeyword = (node: ts.Node) => {
    return ts.factory.createObjectLiteralExpression([
        ts.factory.createPropertyAssignment("type", ts.factory.createStringLiteral("any"))
    ])
}