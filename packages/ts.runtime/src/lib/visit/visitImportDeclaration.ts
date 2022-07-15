import ts from "typescript";
import {Visiter} from "../helpers/types";

export const visitImportDeclaration: Visiter<ts.ImportDeclaration> = (node, metadata) => {
    const {moduleSpecifier, importClause} = node;

    return ts.factory.createImportDeclaration(
        undefined,
        undefined,
        importClause ?
            ts.factory.createImportClause(false, importClause!.name, importClause!.namedBindings)
            : undefined,
        moduleSpecifier,
        undefined
    )
};