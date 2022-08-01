import ts from "typescript";
import { visitNumericLiteral } from "./visitNumericLiteral";
import { visitTypeAliasDeclaration } from "./visitTypeAliasDeclaration";
import { visitStringLiteral } from "./visitStringLiteral";
import { visitBooleanLiteral } from "./visitBooleanLiteral";
import { visitTypeLiteral } from "./visitTypeLiteral";
import { visitPropertySignature } from "./visitPropertySIgnature";
import { visitNumberKeyword } from "./visitNumberKeyword";
import { visitStringKeyword } from "./visitStringKeyword";
import { visitBooleanKeyword } from "./visitBooleanKeyword";
import { visitFunctionType } from "./visitFunctionType";
import { visitParameter } from "./visitParameter";
import { visitAnyKeyword } from "./visitAnyKeyword";
import { visitUnknownKeyword } from "./visitUnknownKeyword";
import { visitUnionType } from "./visitUnionType";
import { Visiter } from "../helpers/types";
import { randomUUID } from "crypto";
import { visitTypeParameter } from "./visitTypeParameter";
import { visitIntersectionType } from "./visitIntersectionType";
import { visitVoidKeyword } from "./visitVoidKeyword";
import { visitTypeReference } from "./visitTypeReference";
import { visitSourceFile } from "./visitSourceFile";
import { visitNullKeyword } from "./visitNullKeyword";
import { visitUndefinedKeyword } from "./visitUndefinedKeyword";
import { visitArrayType } from "./visitArrayType";
import { visitTupleType } from "./visitTupleType";
import { visitInterfaceDeclaration } from "./visitInterfaceDeclaration";
import {visitEnumDeclaration} from "./visitEnumDeclaration";
import {visitImportDeclaration} from "./visitImportDeclaration";
import {visitTypeQuery} from "./visitTypeQuery";

const visitMap: Partial<Record<ts.SyntaxKind, Visiter<any>>> = {
  [ts.SyntaxKind.TypeAliasDeclaration]: visitTypeAliasDeclaration,
  [ts.SyntaxKind.NumericLiteral]: visitNumericLiteral,
  [ts.SyntaxKind.StringLiteral]: visitStringLiteral,
  [ts.SyntaxKind.TrueKeyword]: visitBooleanLiteral,
  [ts.SyntaxKind.FalseKeyword]: visitBooleanLiteral,
  [ts.SyntaxKind.TypeLiteral]: visitTypeLiteral,
  [ts.SyntaxKind.PropertySignature]: visitPropertySignature,
  [ts.SyntaxKind.NumberKeyword]: visitNumberKeyword,
  [ts.SyntaxKind.StringKeyword]: visitStringKeyword,
  [ts.SyntaxKind.BooleanKeyword]: visitBooleanKeyword,
  [ts.SyntaxKind.AnyKeyword]: visitAnyKeyword,
  [ts.SyntaxKind.UnknownKeyword]: visitUnknownKeyword,
  [ts.SyntaxKind.FunctionType]: visitFunctionType,
  [ts.SyntaxKind.Parameter]: visitParameter,
  [ts.SyntaxKind.UnionType]: visitUnionType,
  [ts.SyntaxKind.TypeParameter]: visitTypeParameter,
  [ts.SyntaxKind.IntersectionType]: visitIntersectionType,
  [ts.SyntaxKind.VoidKeyword]: visitVoidKeyword,
  [ts.SyntaxKind.TypeReference]: visitTypeReference,
  [ts.SyntaxKind.SourceFile]: visitSourceFile,
  [ts.SyntaxKind.NullKeyword]: visitNullKeyword,
  [ts.SyntaxKind.UndefinedKeyword]: visitUndefinedKeyword,
  [ts.SyntaxKind.ArrayType]: visitArrayType,
  [ts.SyntaxKind.TupleType]: visitTupleType,
  [ts.SyntaxKind.InterfaceDeclaration]: visitInterfaceDeclaration,
  [ts.SyntaxKind.EnumDeclaration]: visitEnumDeclaration,
  [ts.SyntaxKind.TypeQuery]: visitTypeQuery,
  [ts.SyntaxKind.ImportDeclaration]: visitImportDeclaration,
};

export const visit: Visiter = ({ deps, node, metadata }): ts.Node => {
  console.log("visit", ts.SyntaxKind[node.kind], metadata?.length);
  if (visitMap[node.kind]) {
    return visitMap[node.kind]!({
      node: node,
      metadata: [
        ...(metadata ?? []),
        ts.factory.createPropertyAssignment(
          "id",
          ts.factory.createStringLiteral(deps.id.generateId())
        ),
      ],
      deps: deps,
    });
  }

  if (node.kind === ts.SyntaxKind.LiteralType) {
    visit({
      node: (node as ts.LiteralTypeNode).literal,
      metadata: metadata,
      deps: deps,
    });
  }

  return node.forEachChild((n) => visit({ node: n, deps: deps })) as ts.Node;
};
