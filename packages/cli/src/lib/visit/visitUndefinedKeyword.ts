import ts from "typescript";
import { Visiter } from "../helpers/types";

export const visitUndefinedKeyword: Visiter = ({node, metadata}) => {
    return ts.factory.createObjectLiteralExpression([
        ...metadata ?? [],
        ts.factory.createPropertyAssignment("type", ts.factory.createStringLiteral("undefined"))
    ],true)
}