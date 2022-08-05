import {Resolver} from "../helpers/types";
import { checker } from "../../transform";
import {getType} from "../helpers/getType";

export const resolvePrimitive: Resolver = (node) => {
    // Primitives can be resolved right away
    return checker.typeToTypeNode(
        getType(node), undefined, undefined
    )!;
};