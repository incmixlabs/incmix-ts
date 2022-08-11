import ts from "typescript";

import { Resolver } from "../helpers/types";

export const resolveInterface: Resolver<ts.InterfaceType> = () => {
  throw new Error("Identifiers that reference interfaces aren't handled yet");
  // return node.symbol.declarations![0]! as ts.InterfaceDeclaration;
};
