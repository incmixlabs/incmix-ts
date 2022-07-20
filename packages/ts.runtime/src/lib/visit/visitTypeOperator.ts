import ts, {ObjectLiteralExpression} from "typescript";
import {Visiter} from "../helpers/types";
import {visit} from "./visit";

export const visitTypeOperator: Visiter<ts.TypeOperatorNode> = (params) => {
    const {KeyOfKeyword, UniqueKeyword, ReadonlyKeyword} = ts.SyntaxKind;
    const {operator, type} = params.node;
    let readOnly = false;

    switch (operator) {
        case KeyOfKeyword:
            /*
            * TODO for the keyof operator we need TS to tell us what the key's type is -
            *  - In order to do this we need access to the
            *   compiler API https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
            *  - Then the type returned is either: union of the keys() or the single type specified
            * */
            throw Error("keyof keyword is not supported yet!");
        case UniqueKeyword:
            // The unique keyword is only ever used when followed by a symbol keyword
            // TODO code to handle 'unique symbol'
            break;
        case ReadonlyKeyword:
            readOnly = true;
            break;
        default:
            throw Error("Unsupported keyword in TypeOperator!");
    }

    // TODO have three cases for each type of operator: keyof, unique and readonly
    // TODO visit the type and spread the result of visiting that type into the "encapsulating" object
    return ts.factory.createObjectLiteralExpression([
        ts.factory.createPropertyAssignment(
            "readOnly",
            readOnly ? ts.factory.createTrue() : ts.factory.createFalse()
        ),
        ...(visit({...params, node: type}) as ObjectLiteralExpression).properties
    ], true);
}