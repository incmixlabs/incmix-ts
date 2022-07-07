import ts, { Statement } from "typescript";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitSourceFile: Visiter<ts.SourceFile> = (node) => {
  return ts.factory.createSourceFile(
    node.statements.map(s => visit(s) as Statement),
    node.endOfFileToken,
    node.flags
  );
};
