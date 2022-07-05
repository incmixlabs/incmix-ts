import ts from "typescript";
import { visit } from "./visit";

export const visitPropertySignature = (node: ts.Node) => {
    let identifier: ts.Identifier = null!;
    let value: ts.Node = ts.factory.createKeywordTypeNode(
      ts.SyntaxKind.AnyKeyword
    );

    let index = 0;
    node.forEachChild((cNode) => {
      if (index === 0 && cNode.kind === ts.SyntaxKind.Identifier) {
        identifier = cNode as ts.Identifier;
      }
      if (index === 1 && cNode) {
        value = cNode;
      }
      index++;
    });

    if (!identifier) {
      throw new Error("Couldn't Find Identifier");
    }


    return ts.factory.createPropertyAssignment(
      identifier.text,
      visit(value) as ts.Expression
    );
  };
