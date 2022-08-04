import ts, {UnionOrIntersectionType} from "typescript";
import { checker } from "../../transform";
import {Resolver} from "../helpers/types";
import {resolve} from "./resolve";

const encapsulateAccordingly = (node: ts.Node, types: ts.TypeNode[]) =>
    checker.getTypeAtLocation(node).flags === ts.TypeFlags.Union ?
        ts.factory.createUnionTypeNode(types): ts.factory.createIntersectionTypeNode(types);

export const resolveUnionOrIntersection: Resolver<ts.TypeReferenceNode> = node =>
    encapsulateAccordingly(node,
        (checker.getTypeAtLocation(node) as UnionOrIntersectionType)
            .types.map(child => resolve(child)) as ts.TypeNode[]
    );