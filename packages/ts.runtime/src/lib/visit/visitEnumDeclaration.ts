import ts from "typescript";
import { Visiter } from "../helpers/types";

export const visitEnumDeclaration: Visiter<ts.EnumDeclaration> = (node, metadata) => {
    const {name} = node;

    return ts.factory.createVariableStatement(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createVariableDeclarationList(
            [ts.factory.createVariableDeclaration(
                ts.factory.createIdentifier(`${name.text}_$TSR`),
                undefined,
                undefined,
                ts.factory.createObjectLiteralExpression(
                    [
                        ...metadata ?? [],
                        ts.factory.createPropertyAssignment(
                            ts.factory.createIdentifier("type"),
                            ts.factory.createStringLiteral("enum")
                        ),
                        ts.factory.createPropertyAssignment(
                            ts.factory.createIdentifier("enum"),
                            ts.factory.createIdentifier(name.text)
                        )
                    ],
                    true
                )
            )],
            ts.NodeFlags.Const
        )
    );
};