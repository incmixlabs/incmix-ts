import ts from "typescript";

export const getSourceFile: (node: ts.Node) => ts.SourceFile = (node) => {
  if (ts.isSourceFile(node)) return node;
  else return getSourceFile(node.parent);
};
