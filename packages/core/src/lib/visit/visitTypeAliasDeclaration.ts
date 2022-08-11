import ts, { Expression } from "typescript";

import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitTypeAliasDeclaration: Visiter<ts.TypeAliasDeclaration> = ({
  node,
  /* We can't have metadata */
  deps,
}) => {
  return ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier(node.name.text + `_$TSR`),
          undefined,
          undefined,

          visit({
            node: node.type,
            metadata: [
              !!node.typeParameters?.length &&
                ts.factory.createPropertyAssignment(
                  "generics",
                  ts.factory.createArrayLiteralExpression(
                    node.typeParameters!.map(
                      (typeParameter) =>
                        visit({ node: typeParameter, deps }) as Expression
                    ),
                    true
                  )
                ),
              // TODO: Add Logic to detect documentation,
            ]
              .filter((i) => !!i)
              .map((i) => i as ts.PropertyAssignment),
            deps: deps,
          }) as Expression
        ),
      ],
      ts.NodeFlags.Const
    )
  );
};
