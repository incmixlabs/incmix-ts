import ts from "typescript";

import { Visiter } from "../helpers/types";

export const visitEmptyStatement: Visiter<ts.EmptyStatement> = () => {
  return ts.factory.createEmptyStatement();
};
