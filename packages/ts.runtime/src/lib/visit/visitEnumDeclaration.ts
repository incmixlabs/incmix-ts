import ts from "typescript";
import { Visiter } from "../helpers/types";


export const visitEnumDeclaration: Visiter<ts.EnumDeclaration> = (node, metadata) => {
    const {name} = node;

    return ts.factory.createObjectLiteralExpression(
        [
            ...(metadata ?? []),
            ts.factory.createPropertyAssignment(
                "type",
                ts.factory.createStringLiteral("enum")
            ),
            ts.factory.createPropertyAssignment(
                "enum",
                ts.factory.createIdentifier(name.text)
            ),
        ],
        true
    )
};