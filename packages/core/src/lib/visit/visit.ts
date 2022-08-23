import ts from "typescript";

import { getSourceFile } from "../helpers/getSourceFile";
import { Visiter } from "../helpers/types";
import { visitAnyKeyword } from "./visitAnyKeyword";
import { visitArrayType } from "./visitArrayType";
import { visitBooleanKeyword } from "./visitBooleanKeyword";
import { visitBooleanLiteral } from "./visitBooleanLiteral";
import { visitClassDeclaration } from "./visitClassDeclaration";
import { visitEmptyStatement } from "./visitEmptyStatement";
import { visitEnumDeclaration } from "./visitEnumDeclaration";
import { visitFunctionType } from "./visitFunctionType";
import { visitImportDeclaration } from "./visitImportDeclaration";
import { visitInterfaceDeclaration } from "./visitInterfaceDeclaration";
import { visitIntersectionType } from "./visitIntersectionType";
import { visitLiteralType } from "./visitLiteralType";
import { visitNullKeyword } from "./visitNullKeyword";
import { visitNumberKeyword } from "./visitNumberKeyword";
import { visitNumericLiteral } from "./visitNumericLiteral";
import { visitParameter } from "./visitParameter";
import { visitPropertySignature } from "./visitPropertySIgnature";
import { visitSourceFile } from "./visitSourceFile";
import { visitStringKeyword } from "./visitStringKeyword";
import { visitStringLiteral } from "./visitStringLiteral";
import { visitSymbolKeyword } from "./visitSymbolKeyword";
import { visitTupleType } from "./visitTupleType";
import { visitTypeAliasDeclaration } from "./visitTypeAliasDeclaration";
import { visitTypeLiteral } from "./visitTypeLiteral";
import { visitTypeOperator } from "./visitTypeOperator";
import { visitTypeParameter } from "./visitTypeParameter";
import { visitTypeQuery } from "./visitTypeQuery";
import { visitTypeReference } from "./visitTypeReference";
import { visitUndefinedKeyword } from "./visitUndefinedKeyword";
import { visitUnionType } from "./visitUnionType";
import { visitUnknownKeyword } from "./visitUnknownKeyword";
import { visitVoidKeyword } from "./visitVoidKeyword";

export const visitMap: Partial<Record<ts.SyntaxKind, Visiter<any>>> = {
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
  [ts.SyntaxKind.EmptyStatement]: visitEmptyStatement,
  [ts.SyntaxKind.EnumDeclaration]: visitEnumDeclaration,
  [ts.SyntaxKind.TypeQuery]: visitTypeQuery,
  [ts.SyntaxKind.ImportDeclaration]: visitImportDeclaration,
  [ts.SyntaxKind.SymbolKeyword]: visitSymbolKeyword,
  [ts.SyntaxKind.TypeOperator]: visitTypeOperator,
  [ts.SyntaxKind.ClassDeclaration]: visitClassDeclaration,
  [ts.SyntaxKind.LiteralType]: visitLiteralType,
};

export const visit: Visiter = ({ deps, node, metadata }): ts.Node => {
  if (visitMap[node.kind]) {
    const resultNode = visitMap[node.kind]!({
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

    // Append the JSDoc comments from the input node onto the output node
    if (Object.keys(node).includes("jsDoc")) {
      // Append each JS document comment that precedes this input node onto the output node
      const jsDocList = (node as ts.Node & { jsDoc: ts.NodeArray<ts.JSDoc> })
        .jsDoc;
      jsDocList.forEach((doc) => {
        const printer = ts.createPrinter();
        // Get the text of the JSDoc
        const output = printer
          .printNode(ts.EmitHint.Unspecified, doc, getSourceFile(node))
          .trim()
          .replace(/^\/\*|\*\/$/g, "");
        // Prepend that text of that JSDoc to the output node
        ts.addSyntheticLeadingComment(
          resultNode,
          ts.SyntaxKind.MultiLineCommentTrivia,
          output,
          true
        );
      });
    }

    return resultNode;
  }

  return node.forEachChild((n) => visit({ node: n, deps: deps })) as ts.Node;
};
