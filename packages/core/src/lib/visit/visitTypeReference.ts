import ts from "typescript";

import { Visiter } from "../helpers/types";
import { resolve } from "../resolve/resolve";
import { visit } from "./visit";

export const visitTypeReference: Visiter<ts.TypeReferenceNode> = ({
  node,
  deps,
}) => {
  // Resolve the reference and then visit it
  return visit({ node: resolve(node), deps });
};
