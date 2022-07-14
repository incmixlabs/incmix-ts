import ts, { PropertySignature } from "typescript";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitPropertySignature: Visiter<PropertySignature> = ({
  node,
  metadata,
  deps,
}) => {
  const hasQuestion = !!node.questionToken;
  node.name;
  const type =
    node.type ?? ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);

  return ts.factory.createPropertyAssignment(
    node.name,

    hasQuestion
      ? (visit({
          node: ts.factory.createUnionTypeNode([
            type,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
            ts.factory.createLiteralTypeNode(
              ts.factory.createToken(ts.SyntaxKind.NullKeyword)
            ),
          ]),
          deps,
        }) as ts.Expression)
      : (visit({ node: type, deps }) as ts.Expression)
  );
};
