import ts, { TypeAliasDeclaration } from "typescript";
import { visitNumericLiteral } from "./visitNumericLiteral";
import { visitTypeAliasDeclaration } from "./visitTypeAliasDeclaration";
import { visitStringLiteral } from "./visitStringLiteral";
import { visitBooleanLiteral } from "./visitBooleanLiteral";

export const visit =
  (context: ts.TransformationContext) =>
  (node: ts.Node): ts.Node => {
    if (node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
      return visitTypeAliasDeclaration(context)(node as TypeAliasDeclaration);
    }

    if (node.kind === ts.SyntaxKind.NumericLiteral) {
      return visitNumericLiteral(context)(node);
    }

    if (node.kind === ts.SyntaxKind.StringLiteral) {
      return visitStringLiteral(context)(node);
    }

    if (
      node.kind === ts.SyntaxKind.TrueKeyword ||
      node.kind === ts.SyntaxKind.FalseKeyword
    ) {
      return visitBooleanLiteral(context)(node);
    }

    if (node.kind === ts.SyntaxKind.LiteralType) {
      return visit(context)((node as ts.LiteralTypeNode).literal);
    }

    // if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
    //   return visitInterfaceDeclaration(node, context);
    // }
    // if (node.kind === ts.SyntaxKind.EnumDeclaration) {
    //   return visitEnumDeclaration(node, context);
    // }

    return ts.visitEachChild(node, visit(context), context);
  };
