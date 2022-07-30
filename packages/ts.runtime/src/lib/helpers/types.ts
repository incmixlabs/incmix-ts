import ts from "typescript";
import { Id } from "../../Id";

export type Visiter<T extends ts.Node = ts.Node> = (params: {
  node: T;
  metadata?: ts.PropertyAssignment[];
  deps: { id: Id };
}) => ts.Node;

export type Resolver = (node: ts.TypeReferenceNode) => ts.Node;
