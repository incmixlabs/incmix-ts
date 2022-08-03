import ts, { Statement } from "typescript";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

function includeNode(node: ts.Node) {
  const exclusionList: readonly ts.SyntaxKind[] = [
      ts.SyntaxKind.VariableStatement,
  ];
  const isNotANonexportedType =
      !ts.isTypeAliasDeclaration(node) ||
      ts.isTypeAliasDeclaration(node) &&
      !!(node as ts.TypeAliasDeclaration).modifiers &&
      !!(node as ts.TypeAliasDeclaration).modifiers!
          .find(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);

  return isNotANonexportedType && !exclusionList.includes(node.kind);
}

export const visitSourceFile: Visiter<ts.SourceFile> = ({ node, deps }) => {
  return ts.factory.createSourceFile(
    node.statements
        .filter(includeNode)
        .map((s) => visit({ deps, node: s }) as Statement),
    node.endOfFileToken,
    node.flags
  );
};
