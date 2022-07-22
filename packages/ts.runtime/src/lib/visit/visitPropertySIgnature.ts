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

    // TODO add code to check if visit generates a typeIsReadOnly - if it doesn't then add the attribute and set it to false

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
