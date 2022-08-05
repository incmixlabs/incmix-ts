import ts from "typescript";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitInterfaceDeclaration: Visiter<ts.ClassLikeDeclaration> = ({
  node,
  metadata,
  deps,
}) => {
  const members = node.members;
  const typeParameters = node.typeParameters;
  return ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier(node.name!.text + `_$TSR`),
          undefined,
          undefined,
          ts.factory.createObjectLiteralExpression(
            [
              ...(metadata ?? []),
              ts.factory.createPropertyAssignment(
                "type",
                ts.factory.createStringLiteral("interface")
              ),
              ts.factory.createPropertyAssignment(
                "members",
                ts.factory.createObjectLiteralExpression(
                  members.map(
                    (member) =>
                      visit({ node: member, deps }) as ts.PropertyAssignment
                  ),
                  true
                )
              ),
              typeParameters
                ? ts.factory.createPropertyAssignment(
                    "generics",
                    ts.factory.createArrayLiteralExpression(
                      typeParameters?.map(
                        (node) => visit({ node, deps }) as ts.Expression
                      ),
                      true
                    )
                  )
                : undefined,
            ]
              .filter((item) => item)
              .map((item) => item!),
            true
          )
        ),
      ],
      ts.NodeFlags.Const
    )
  );
};
