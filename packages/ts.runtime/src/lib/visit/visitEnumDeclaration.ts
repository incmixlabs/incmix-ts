import ts, {Identifier} from "typescript";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";
import {mapNodeChildren} from "../helpers/mapNodeChildren";

const visitEnumMember: Visiter<ts.EnumMember> = (node, metadata) => {
    // TODO determine how to use metadata to maintain references between enum members
    const name = node.name as Identifier;
    const {initializer} = node;

    return ts.factory.createObjectLiteralExpression(
        [
            ...(metadata ?? []),
            ts.factory.createPropertyAssignment(
                "identifier",
                ts.factory.createStringLiteral(name.text)
            ),
            initializer ?
            ts.factory.createPropertyAssignment(
                "initializer",
                // TODO - assume visit can handle any Expression type
                visit(initializer, metadata) as ts.Expression
            ) : undefined,
        ].filter(node => node).map(node => node!),
        true
    )
}

export const visitEnumDeclaration: Visiter<ts.EnumDeclaration> = (node, metadata) => {
    const {name, members} = node;

    return ts.factory.createObjectLiteralExpression(
        [
            ...(metadata ?? []),
            ts.factory.createPropertyAssignment(
                "type",
                ts.factory.createStringLiteral("enum")
            ),
            ts.factory.createPropertyAssignment(
                "identifier",
                ts.factory.createStringLiteral(name.text)
            ),
            ts.factory.createPropertyAssignment(
                "members",
                ts.factory.createArrayLiteralExpression(
                    members.map(member => visitEnumMember(member, metadata)) as ts.Expression[],
                    true
                )
            ),
        ],
        true
    )
};