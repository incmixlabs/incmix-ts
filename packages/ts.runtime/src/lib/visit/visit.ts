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
import { visitFunctionType } from "./visitFunctionType";
import { visitParameter } from "./visitParameter";
import { visitAnyKeyword } from "./visitAnyKeyword";
import { visitUnknownKeyword } from "./visitUnknownKeyword";

export const visit = (node: ts.Node): ts.Node => {
  console.log(node?.kind);
  if (node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
    return visitTypeAliasDeclaration(node as TypeAliasDeclaration);
  }

  if (node.kind === ts.SyntaxKind.NumericLiteral) {
    return visitNumericLiteral(node);
  }

  if (node.kind === ts.SyntaxKind.StringLiteral) {
    return visitStringLiteral(node);
  }

  if (
    node.kind === ts.SyntaxKind.TrueKeyword ||
    node.kind === ts.SyntaxKind.FalseKeyword
  ) {
    return visitBooleanLiteral(node);
  }

  if (node.kind === ts.SyntaxKind.TypeLiteral) {
    return visitTypeLiteral(node as ts.TypeLiteralNode);
  }

  if (node.kind === ts.SyntaxKind.LiteralType) {
    return visit((node as ts.LiteralTypeNode).literal);
  }

  if (node.kind === ts.SyntaxKind.PropertySignature) {
    return visitPropertySignature(node);
  }

  if (node.kind === ts.SyntaxKind.NumberKeyword) {
    return visitNumberKeyword(node);
  }

  if (node.kind === ts.SyntaxKind.StringKeyword) {
    return visitStringKeyword(node);
  }

  if (node.kind === ts.SyntaxKind.BooleanKeyword) {
    return visitBooleanKeyword(node);
  }

  if (node.kind === ts.SyntaxKind.FunctionType) {
    return visitFunctionType(node as ts.FunctionTypeNode);
  }

  if (node.kind === ts.SyntaxKind.Parameter) {
    return visitParameter(node as ts.ParameterDeclaration);
  }

  if (node.kind === ts.SyntaxKind.AnyKeyword) {
    return visitAnyKeyword(node);
  }

  if (node.kind === ts.SyntaxKind.UnknownKeyword) {
    return visitUnknownKeyword(node);
  }

  // if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
  //   return visitInterfaceDeclaration(node, context);
  // }
  // if (node.kind === ts.SyntaxKind.EnumDeclaration) {
  //   return visitEnumDeclaration(node, context);
  // }

  return node.forEachChild(visit) as ts.Node;
};
