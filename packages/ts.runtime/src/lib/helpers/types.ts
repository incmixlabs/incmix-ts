import ts from "typescript";

export type Visiter<T extends ts.Node = ts.Node> = (
  node: T,
  metadata?: ts.PropertyAssignment[]
) => ts.Node;
