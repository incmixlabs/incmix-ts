import { checker } from "../../transform";
import { getType } from "../helpers/getType";
import { Resolver } from "../helpers/types";

export const resolvePrimitive: Resolver = (node) => {
  // Primitives can be resolved right away
  return checker.typeToTypeNode(getType(node), undefined, undefined)!;
};
