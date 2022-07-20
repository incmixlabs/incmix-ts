import ts from "typescript";
import {Visiter} from "../helpers/types";
import {visit} from "./visit";

export const visitTypeOperator: Visiter<ts.TypeOperatorNode> = (params) => {
    const {KeyOfKeyword, UniqueKeyword, ReadonlyKeyword} = ts.SyntaxKind;
    const {operator, type} = params.node;

    let readOnly = false;
    let body: ts.PropertyAssignment[] | undefined = undefined;

    switch (operator) {
        case KeyOfKeyword:
            /*
            * TODO
            *  For the keyof operator we need TS compiler API to tell us what the key's type is -
            *  - In order to do this we need access to the
            *   compiler API https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
            *  - Then the type returned is either: union of the keys() or the single type specified
            * */
            // TODO put me back - throw Error("keyof keyword is not supported yet!");
            break;
        case UniqueKeyword:
            // The unique keyword is only ever used when followed by a symbol keyword
            body = [
                ts.factory.createPropertyAssignment(
                    "type",
                    ts.factory.createStringLiteral("unique symbol")
                ),
                ts.factory.createPropertyAssignment(
                    "uniqueSymbolId",
                    // TODO look to TS compiler API for the unique symbol's id
                    ts.factory.createStringLiteral("ID FUNCTIONALITY NOT IMPLEMENTED YET")
                ),
            ];
            break;
        case ReadonlyKeyword:
            readOnly = true;
            break;
        default:
            // TODO Look into better way of handling this
            throw Error("Unsupported keyword in TypeOperator!");
    }

    return ts.factory.createObjectLiteralExpression([
        ts.factory.createPropertyAssignment(
            "tsRuntimeObject",
            ts.factory.createObjectLiteralExpression([
                ts.factory.createPropertyAssignment(
                    "readOnly",
                    readOnly ? ts.factory.createTrue() : ts.factory.createFalse()
                ),
                ...(body ?? (visit({...params, node: type}) as ts.ObjectLiteralExpression).properties)
            ], true)
        )
    ], true);
}