import ts, { PropertySignature } from "typescript";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitPropertySignature: Visiter<PropertySignature> = (
  node,
  metadata
) => {
  const hasQuestion = !!node.questionToken;
  node.name;
  const type =
    node.type ?? ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);

  return ts.factory.createPropertyAssignment(
    node.name,

    hasQuestion
      ? visit(
          ts.factory.createUnionTypeNode([
            type,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
            ts.factory.createLiteralTypeNode(
              ts.factory.createToken(ts.SyntaxKind.NullKeyword)
            ),
          ])
        ) as ts.Expression
      : visit(type) as ts.Expression
  );
};
