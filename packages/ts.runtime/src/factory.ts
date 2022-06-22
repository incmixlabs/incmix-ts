import * as ts from "typescript";
import {
  visitTypeAliasDeclaration,
  visitInterfaceDeclaration,
  visitEnumDeclaration,
} from "./transform";

type Fn = (_ctx: ts.TransformationContext) => void;

export function getTransformerFactory(fn: Fn, addSourceText: boolean = false) {
  const transformerFactory: ts.TransformerFactory<ts.Node> = (
    context: ts.TransformationContext
  ) => {
    return (rootNode) => {
      function visit(node: ts.Node): ts.Node {
        fn(context);
        if (node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
          return visitTypeAliasDeclaration(node, context, addSourceText);
        }
        if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
          return visitInterfaceDeclaration(node, context);
        }
        if (node.kind === ts.SyntaxKind.EnumDeclaration) {
          return visitEnumDeclaration(node, context);
        }
        return ts.visitEachChild(node, visit, context);
      }
      return ts.visitNode(rootNode, visit);
    };
  };
  return transformerFactory;
}
