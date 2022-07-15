import ts from "typescript";
import { Visiter } from "../helpers/types";
import {randomUUID} from "crypto";

// Desired output:
// export enum Enum {
//     A,
//     B = 2,
//     C = B * 2,
//     D = "12".length
// }
//
// export const Enum_$TSR = {
//     id: "ce3a032b-0309-48fd-b32a-dda0a47db2c1",
//     type: "enum",
//     enum: Enum
// }



export const visitEnumDeclaration: Visiter<ts.EnumDeclaration> = (node, metadata) => {
    const {name} = node;

    // TODO both of these are required at runtime -
    //  * the {type: "enum"...} is required to show that an enum is being used
    //  * and the actual enum is required so that the reference to the symbol in the above object can be resolved

    // return ts.factory.createEnumDeclaration(
    //     undefined,
    //     [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    //     ts.factory.createIdentifier("Enum"),
    //     node.members
    // );

    return ts.factory.createVariableStatement(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createVariableDeclarationList(
            [ts.factory.createVariableDeclaration(
                ts.factory.createIdentifier(`${name.text}_$TSR`),
                undefined,
                undefined,
                ts.factory.createObjectLiteralExpression(
                    [
                        ts.factory.createPropertyAssignment(
                            ts.factory.createIdentifier("id"),
                            ts.factory.createStringLiteral(randomUUID())
                        ),
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