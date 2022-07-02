import * as ts from "typescript";
import { visit } from "./lib/visit/visit";

type Fn = (_ctx: ts.TransformationContext) => void;

export function getTransformerFactory(fn: Fn, addSourceText: boolean = false) {
  const transformerFactory: ts.TransformerFactory<ts.Node> = (
    context: ts.TransformationContext
  ) => {
    return (rootNode) => {
      return ts.visitNode(rootNode, visit(context));
    };
  };
  return transformerFactory;
}
