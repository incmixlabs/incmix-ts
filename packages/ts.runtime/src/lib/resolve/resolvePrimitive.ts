import ts from "typescript";
import {Resolver} from "../helpers/types";
import { checker } from "../../transform";

export const resolvePrimitive: Resolver<ts.TypeReferenceNode> = (node) => {
    // Primitives can be resolved right away
    return checker.typeToTypeNode(
        checker.getTypeAtLocation(node), undefined, undefined
    )!;
};