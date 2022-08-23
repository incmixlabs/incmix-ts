import ts from "typescript";

import { visitMap } from "../visit/visit";

export const includeNode: (node: ts.Node) => boolean = (node) => {
  const inclusionList: readonly ts.SyntaxKind[] = Object.keys(visitMap).map(
    (k) => +k
  );

  const isNotANonexportedType =
    !ts.isTypeAliasDeclaration(node) ||
    (ts.isTypeAliasDeclaration(node) &&
      !!(node as ts.TypeAliasDeclaration).modifiers &&
      !!(node as ts.TypeAliasDeclaration).modifiers!.find(
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
      ));

  return isNotANonexportedType && inclusionList.includes(node.kind);
};
