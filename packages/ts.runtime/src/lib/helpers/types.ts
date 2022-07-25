import ts from "typescript";
import { Id } from "../../deps/Id";

export type Visiter<T extends ts.Node = ts.Node> = (params: {
  node: T;
  metadata?: ts.PropertyAssignment[];
  deps: { id: Id };
}) => ts.Node;
