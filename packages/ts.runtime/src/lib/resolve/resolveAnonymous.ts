import ts from "typescript";
import { Resolver } from "../helpers/types";

export const resolveAnonymous: Resolver<ts.ObjectType | ts.TypeReferenceNode> = node => {
    // TODO determine if this resolver needs to handle TypeReferenceNodes
    return (node as ts.ObjectType).symbol.declarations![0]!;
}