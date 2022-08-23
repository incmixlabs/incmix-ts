import ts from "typescript";

import { Visiter } from "../helpers/types";

export const visitClassDeclaration: Visiter<ts.ClassDeclaration> = ({
  node,
}): ts.Node => {
  return node;
};
