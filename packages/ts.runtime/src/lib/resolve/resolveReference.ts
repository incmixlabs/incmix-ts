import {TypeFlags} from "typescript";
import {checker} from "../../transform";
import {Resolver} from "../helpers/types";
import {resolvePrimitive} from "./resolvePrimitive";

const resolutionMap: Partial<Record<TypeFlags, Resolver>> = {
    [TypeFlags.Any]: resolvePrimitive,
    [TypeFlags.Unknown]: resolvePrimitive,
    [TypeFlags.String]: resolvePrimitive,
    [TypeFlags.Number]: resolvePrimitive,
    [TypeFlags.Boolean]: resolvePrimitive,
    [TypeFlags.BigInt]: resolvePrimitive,
    [TypeFlags.StringLiteral]: resolvePrimitive,
    [TypeFlags.NumberLiteral]: resolvePrimitive,
    [TypeFlags.BooleanLiteral]: resolvePrimitive,
    [TypeFlags.BigIntLiteral]: resolvePrimitive,
};

export const resolveReference: Resolver = (node) => {
    // Primitives can just be resolved right away, whereas more complex types
    // have their first layer of children resolved
    const nodeType = checker.getTypeAtLocation(node).flags;
    if (resolutionMap[nodeType]) return resolutionMap[nodeType]!(node);
    else throw new Error(`Identifiers which reference the type: ${TypeFlags[nodeType]} are not supported yet!`);
};