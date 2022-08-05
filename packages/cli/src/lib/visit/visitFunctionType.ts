import ts, {
  Expression,
  FunctionTypeNode,
  PropertyAssignment,
} from "typescript";

import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitFunctionType: Visiter<FunctionTypeNode> = ({
  node,
  metadata,
  deps,
}) => {
  const children = mapNodeChildren(node, (n) => n);
  return ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      !!node.typeParameters?.length &&
        ts.factory.createPropertyAssignment(
          "functionGenerics",
          ts.factory.createArrayLiteralExpression(
            node.typeParameters!.map(
              (typeParameter) =>
                visit({ node: typeParameter, deps }) as Expression
            ),
            true
          )
        ),
      ts.factory.createPropertyAssignment(
        "type",
        ts.factory.createStringLiteral("function")
      ),
      ts.factory.createPropertyAssignment(
        "parameters",
        ts.factory.createArrayLiteralExpression(
          node.parameters.map((n) => visit({ node: n, deps })) as Expression[],
          true
        )
      ),
      ts.factory.createPropertyAssignment(
        "returns",
        visit({ node: children.at(-1)!, deps }) as Expression
      ),
    ]
      .filter((i) => i)
      .map((item) => item as PropertyAssignment),
    true
  );
};
