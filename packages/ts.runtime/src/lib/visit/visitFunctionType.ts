import ts, {
  Expression,
  FunctionTypeNode,
  PropertyAssignment,
} from "typescript";
import { mapNodeChildren } from "../helpers/mapNodeChildren";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";

export const visitFunctionType: Visiter<FunctionTypeNode> = (
  node,
  metadata
) => {
  const children = mapNodeChildren(node, (n) => n);
  return ts.factory.createObjectLiteralExpression(
    [
      ...(metadata ?? []),
      !!node.typeParameters?.length &&
        ts.factory.createPropertyAssignment(
          "functionGenerics",
          ts.factory.createArrayLiteralExpression(
            node.typeParameters!.map(
              (typeParameter) => visit(typeParameter) as Expression
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
          node.parameters.map((n) => visit(n)) as Expression[],
          true
        )
      ),
      ts.factory.createPropertyAssignment(
        "returns",
        visit(children.at(-1)!) as Expression
      ),
    ]
      .filter((i) => i)
      .map((item) => item as PropertyAssignment),
    true
  );
};
