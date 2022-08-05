import ts from "typescript";

import { getType } from "../helpers/getType";
import { Resolver } from "../helpers/types";
import { resolveAnonymous } from "./resolveAnonymous";
import { resolveInterface } from "./resolveInterface";

const objResMap: Partial<Record<ts.ObjectFlags, Resolver<any>>> = {
  [ts.ObjectFlags.Interface]: resolveInterface,
  [ts.ObjectFlags.Anonymous]: resolveAnonymous,
};

export const resolveObject: Resolver<ts.TypeReferenceNode> = (node) => {
  const typeObj = getType<ts.ObjectType>(node);
  const { objectFlags } = typeObj;

  console.log("resolve object", ts.ObjectFlags[objectFlags], objectFlags);
  if (objResMap[objectFlags]) return objResMap[objectFlags]!(typeObj);
  else
    throw new Error(
      `Identifiers which reference the objects of type: ${ts.ObjectFlags[objectFlags]} are not supported yet!`
    );
};
