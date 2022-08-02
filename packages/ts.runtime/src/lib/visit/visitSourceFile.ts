import ts, { Statement } from "typescript";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

function includeNode(node: ts.Node) {
  const exclusionList: readonly ts.SyntaxKind[] = [
      // TODO populate this list with the nodes to exclude
  ];
  const isAnExportedType =
      ts.isTypeAliasDeclaration(node) &&
      !!(node as ts.TypeAliasDeclaration).modifiers &&
      !!(node as ts.TypeAliasDeclaration).modifiers!
          .find(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);

  return isAnExportedType && !exclusionList.includes(node.kind);
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
