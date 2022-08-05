import ts from "typescript";
import {checker} from "../../transform";
import {Resolver} from "../helpers/types";
import {resolvePrimitive} from "./resolvePrimitive";
import {resolveUnionOrIntersection} from "./resolveUnionOrIntersection";
import {resolveObject} from "./resolveObject";
import {getType} from "../helpers/getType";

const resolutionMap: Partial<Record<ts.TypeFlags, Resolver<any>>> = {
    [ts.TypeFlags.Any]: resolvePrimitive,
    [ts.TypeFlags.Unknown]: resolvePrimitive,
    [ts.TypeFlags.String]: resolvePrimitive,
    [ts.TypeFlags.Number]: resolvePrimitive,
    [ts.TypeFlags.Boolean | ts.TypeFlags.Union]: resolvePrimitive,
    [ts.TypeFlags.BigInt]: resolvePrimitive,
    [ts.TypeFlags.StringLiteral]: resolvePrimitive,
    [ts.TypeFlags.NumberLiteral]: resolvePrimitive,
    [ts.TypeFlags.BooleanLiteral]: resolvePrimitive,
    [ts.TypeFlags.BigIntLiteral]: resolvePrimitive,
    [ts.TypeFlags.Union]: resolveUnionOrIntersection,
    [ts.TypeFlags.Intersection]: resolveUnionOrIntersection,
    [ts.TypeFlags.UnionOrIntersection]: resolveUnionOrIntersection,
    [ts.TypeFlags.Object]: resolveObject,
};

export const resolve: Resolver = (node) => {
    const nodeType = getType(node).flags;
    console.log("resolve", `ts.TypeFlags[${nodeType}]=${ts.TypeFlags[nodeType]}`, ts.isTypeReferenceNode(node as ts.Node) ? "Type Ref Node": "Type");

    if (resolutionMap[nodeType])
        return resolutionMap[nodeType]!(node);
    else
        throw new Error(`Identifiers which reference the type: ${ts.TypeFlags[nodeType]} are not supported yet!`);
};