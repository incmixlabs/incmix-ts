import ts, {UnionType} from "typescript";
import { checker } from "../../transform";
import {Resolver} from "../helpers/types";

export const resolveUnion: Resolver = node =>
    ts.factory.createUnionTypeNode(
        (checker.getTypeAtLocation(node) as UnionType)
            .types.map(
                unionChild => checker.typeToTypeNode(
                    unionChild,
                    undefined,
                    undefined
                )!
            )
    );