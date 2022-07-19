import ts, {Identifier} from "typescript";
import {Visiter} from "../helpers/types";

export const visitTypeQuery: Visiter<ts.TypeQueryNode> = ({node, metadata, deps}) => {
    const statement = ts.factory.createQualifiedName(ts.factory.createIdentifier("a"), "b");

    const printer = ts.createPrinter();

    const result = printer.printNode(
        ts.EmitHint.Unspecified,
        statement,
        //@ts-ignore
        undefined
    );

    console.log(result)

    return ts.factory.createObjectLiteralExpression(
        [
            ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier("type"),
                ts.factory.createStringLiteral("uniqueSymbol")
            ),
            ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier("symbol"),
                node.exprName as Identifier
            )
        ],
        true
    );
};
