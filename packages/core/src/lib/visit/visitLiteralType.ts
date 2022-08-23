import ts from "typescript";

import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitLiteralType: Visiter<ts.LiteralTypeNode> = ({
  deps,
  node,
}): ts.Node => {
  return visit({
    node: (node as ts.LiteralTypeNode).literal,
    deps: deps,
  });
};
