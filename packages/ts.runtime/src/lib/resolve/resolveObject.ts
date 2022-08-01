import ts from "typescript";
import { Resolver } from "../helpers/types";
import {resolveInterface} from "./resolveInterface";
import {checker} from "../../transform";
import {resolveAnonymous} from "./resolveAnonymous";

const objResMap: Partial<Record<ts.ObjectFlags, Resolver<any>>> = {
    [ts.ObjectFlags.Interface]: resolveInterface,
    [ts.ObjectFlags.Anonymous]: resolveAnonymous,
};

export const resolveObject: Resolver<ts.ObjectType | ts.TypeReferenceNode> = node => {
    node = ((ts.isTypeReferenceNode(node as ts.Node) ?
        checker.getTypeAtLocation(node as ts.TypeReferenceNode) : node
    ) as ts.ObjectType);
    const {objectFlags} = node;

    console.log("resolve object", ts.ObjectFlags[objectFlags], objectFlags);
    if (objResMap[objectFlags]) return objResMap[objectFlags]!(node);
    else throw new Error(`Identifiers which reference the objects of type: ${ts.ObjectFlags[objectFlags]} are not supported yet!`);
}