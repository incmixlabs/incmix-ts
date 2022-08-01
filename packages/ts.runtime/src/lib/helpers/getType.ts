import ts from "typescript";
import {checker} from "../../transform";

export const getType = <T extends ts.Type>(node: T | ts.TypeReferenceNode) =>
    ((ts.isTypeReferenceNode(node as ts.Node) ?
        checker.getTypeAtLocation(node as ts.TypeReferenceNode) : node
    ) as T)