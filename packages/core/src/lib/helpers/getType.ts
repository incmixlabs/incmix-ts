import ts from "typescript";

import { checker } from "../../transform";

export const getType = <T extends ts.Type = ts.Type>(node: T | ts.TypeNode) =>
  (ts.isTypeNode(node as ts.Node)
    ? checker.getTypeAtLocation(node as ts.TypeNode)
    : node) as T;
