import ts from "typescript";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitTupleType: Visiter<ts.TupleTypeNode> = ({
  node,
  metadata,
  deps,
}) => {
  return ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("tuple")
      ),
      ts.factory.createPropertyAssignment(
        "itemsAreReadOnly",
        ts.factory.createFalse()
      ),
      ts.factory.createPropertyAssignment(
        "items",
        ts.factory.createArrayLiteralExpression(
          node.elements.map((node) => {
            if (node.kind === ts.SyntaxKind.NamedTupleMember) {
              const ntm = node as ts.NamedTupleMember;
              const spread = !!ntm.dotDotDotToken;
              const optional = !!ntm.questionToken;
              const type = ntm.type;
              const name = ntm.name.text;

              return getTupleItemPart({ spread, optional, type, name, deps });
            }

            if (node.kind === ts.SyntaxKind.RestType) {
              const rtn = node as ts.RestTypeNode;
              const type = rtn.type;

              return getTupleItemPart({
                spread: true,
                optional: false,
                type,
                name: undefined,
                deps,
              });
            }

            const tn = node as ts.TypeNode;
            return getTupleItemPart({
              spread: false,
              optional: false,
              type: tn,
              name: undefined,
              deps,
            });
          }),
          true
        )
      ),
    ],
    true
  );
};

const getTupleItemPart = ({
  spread,
  optional,
  name,
  type,
  deps,
}: {
  spread: boolean;
  optional: boolean;
  name: string | undefined;
  type: ts.TypeNode;
  deps: Parameters<Visiter>[0]["deps"];
}) => {
  return ts.factory.createObjectLiteralExpression(
    [
      name &&
        ts.factory.createPropertyAssignment(
          "name",
          ts.factory.createStringLiteral(name)
        ),
      ts.factory.createPropertyAssignment(
        "spread",
        spread ? ts.factory.createTrue() : ts.factory.createFalse()
      ),
      ts.factory.createPropertyAssignment(
        "optional",
        optional ? ts.factory.createTrue() : ts.factory.createFalse()
      ),
      ts.factory.createPropertyAssignment(
        "tsRuntimeObject",
        visit({ node: type, deps }) as ts.Expression
      ),
    ]
      .filter((item) => item)
      .map((item) => item as ts.PropertyAssignment),
    true
  );
};
