import ts from "typescript";
import { Id } from "../../Id";

export type Visiter<T extends ts.Node = ts.Node> = (params: {
  node: T;
  metadata?: ts.PropertyAssignment[];
  deps: { id: Id };
}) => ts.Node;

export type Resolver<T extends ts.TypeNode | ts.Type = ts.TypeNode | ts.Type> = (node: T) => ts.Node;