import ts, {PropertySignature} from "typescript";
import {Visiter} from "../helpers/types";
import {visit} from "./visit";

export const visitPropertySignature: Visiter<PropertySignature> = ({
   node,
   metadata,
   deps,
}) => {
    const isOptional = !!node.questionToken;
    const type = node.type ?? ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);

    return ts.factory.createPropertyAssignment(
        node.name,
        ts.factory.createObjectLiteralExpression([
            ts.factory.createPropertyAssignment(
                "optional",
                isOptional ? ts.factory.createTrue() : ts.factory.createFalse()
            ),
            ...((isOptional
                ? visit({
                    node: ts.factory.createUnionTypeNode([
                        type,
                        ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)
                    ]),
                    deps,
                })
                : visit({ node: type, deps })) as ts.ObjectLiteralExpression).properties
        ], true)
    );
};
