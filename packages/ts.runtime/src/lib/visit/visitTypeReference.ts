import ts, { Expression, PropertyAssignment } from "typescript";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitTypeReference: Visiter<ts.TypeReferenceNode> = ({
  node,
  metadata,
  deps,
}) => {
  const children = mapNodeChildren(node, (n) => n);

  let identifier: ts.Identifier = null!;
  children.forEach((cNode) => {
    if (cNode.kind === ts.SyntaxKind.Identifier) {
      identifier = cNode as ts.Identifier;
    }
  });

  if (!identifier) {
    throw new Error("Couldn't find identifier");
  }

  return ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("reference")
      ),
      ts.factory.createPropertyAssignment(
        "referenceName",
        ts.factory.createStringLiteral(identifier.text)
      ),
      node.typeArguments?.length &&
        ts.factory.createPropertyAssignment(
          "filledGenerics",
          ts.factory.createArrayLiteralExpression(
            node.typeArguments?.map(
              (typeArg) => visit({ node: typeArg, deps }) as Expression
            ),
            true
          )
        ),
    ]
      .filter((item) => item)
      .map((item) => item as PropertyAssignment),
    true
  );
};
