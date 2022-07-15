import ts, {Identifier} from "typescript";
import { Visiter } from "../helpers/types";

export const visitTypeQuery: Visiter<ts.TypeQueryNode> = (node, metadata) => {

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
