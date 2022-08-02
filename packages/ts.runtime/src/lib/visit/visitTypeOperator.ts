import ts from "typescript";
import {Visiter} from "../helpers/types";
import {visit} from "./visit";

export const visitTypeOperator: Visiter<ts.TypeOperatorNode> = ({node, metadata, deps}) => {
    const {KeyOfKeyword, UniqueKeyword, ReadonlyKeyword} = ts.SyntaxKind;
    const {operator, type} = node;

    switch (operator) {
        case KeyOfKeyword:
            /*
            * TODO
            *  For the keyof operator we need TS compiler API to tell us what the key's type is -
            *  - In order to do this we need access to the
            *   compiler API https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
            *  - Then the type returned is either: union of the keys() or the single type specified
            * */
            throw Error("keyof keyword is not supported yet!");
        case UniqueKeyword:
            // The unique keyword is only ever used when followed by a symbol keyword
            return ts.factory.createObjectLiteralExpression([
                ...metadata ?? [],
                ts.factory.createPropertyAssignment(
                    "type",
                    ts.factory.createStringLiteral("unique symbol")
                ),
                ts.factory.createPropertyAssignment(
                    "uniqueSymbolTypeId",
                    /*
                    * Symbols guarantee uniqueness - so use a symbol at the front-end to ensure that
                    * a symbol can be used to identify the type of the unique symbol
                    * */
                    ts.factory.createCallExpression(
                        ts.factory.createIdentifier("Symbol"),
                        undefined, []
                    )
                )
            ], true);
        case ReadonlyKeyword:
            // In this context, the readonly keyword can only be followed by a tuple or array
            return ts.factory.createObjectLiteralExpression([
                /*
                * Visit the tuple or array and update the value of its itemsAreReadOnly property by
                * creating a new object with all its properties - save for itemsAreReadOnly - and then
                * add a itemsAreReadOnly property, to which true is assigned
                * */
                ...(visit({node: type, deps}) as ts.ObjectLiteralExpression).properties
                    .filter(
                        properties =>
                            ((properties as ts.PropertyAssignment).name as ts.StringLiteral).text !== "itemsAreReadOnly"
                    ),
                ts.factory.createPropertyAssignment("itemsAreReadOnly", ts.factory.createTrue())
            ], true);
    }
}