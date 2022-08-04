import ts from "typescript";
import { Resolver } from "../helpers/types";

export const resolveAnonymous: Resolver<ts.ObjectType> = node => {
    return node.symbol.declarations![0]!;
}