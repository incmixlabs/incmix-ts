import ts, { ObjectLiteralExpression, TypeAliasDeclaration } from "typescript";
import { visitNumericLiteral } from "./visitNumericLiteral";
import { visitTypeAliasDeclaration } from "./visitTypeAliasDeclaration";
import { visitStringLiteral } from "./visitStringLiteral";
import { visitBooleanLiteral } from "./visitBooleanLiteral";
import { visitTypeLiteral } from "./visitTypeLiteral";
import { visitPropertySignature } from "./visitPropertySIgnature";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { visitNumberKeyword } from "./visitNumberKeyword";
import { visitStringKeyword } from "./visitStringKeyword";
import { visitBooleanKeyword } from "./visitBooleanKeyword";

export const visit =
  (context: ts.TransformationContext) =>
  (node: ts.Node): ts.Node => {
    console.log(node?.kind);
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

    if (node.kind === ts.SyntaxKind.TypeLiteral) {
      return visitTypeLiteral(context)(node as ts.TypeLiteralNode);
    }

    if (node.kind === ts.SyntaxKind.LiteralType) {
      return visit(context)((node as ts.LiteralTypeNode).literal);
    }

    if (node.kind === ts.SyntaxKind.PropertySignature) {
      return visitPropertySignature(context)(node);
    }

    if (node.kind === ts.SyntaxKind.NumberKeyword) {
      return visitNumberKeyword(context)(node);
    }

    if (node.kind === ts.SyntaxKind.StringKeyword) {
      return visitStringKeyword(context)(node);
    }

    if (node.kind === ts.SyntaxKind.BooleanKeyword) {
      return visitBooleanKeyword(context)(node);
    }

    // if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
    //   return visitInterfaceDeclaration(node, context);
    // }
    // if (node.kind === ts.SyntaxKind.EnumDeclaration) {
    //   return visitEnumDeclaration(node, context);
    // }

    return node.forEachChild(visit(context)) as ts.Node;
  };
