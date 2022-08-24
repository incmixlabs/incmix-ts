import ts from "typescript";

import { Visiter } from "../helpers/types";

export const visitBigInt: Visiter<ts.BigIntLiteral> = ({ node }) => {
  return ts.factory.createBigIntLiteral(node.text);
};
