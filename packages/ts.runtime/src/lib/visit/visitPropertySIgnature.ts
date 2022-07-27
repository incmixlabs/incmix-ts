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
                "type",
                ts.factory.createStringLiteral("propertySignature")
            ),
            ts.factory.createPropertyAssignment(
                "optional",
                isOptional ? ts.factory.createTrue() : ts.factory.createFalse()
            ),
            ts.factory.createPropertyAssignment(
                "tsRuntimeObject",
                isOptional
                    ? (visit({
                        node: ts.factory.createUnionTypeNode([
                            type,
                            ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)
                        ]),
                        deps,
                    }) as ts.Expression)
                    : (visit({ node: type, deps }) as ts.Expression)
            )
        ], true)
    );
};
