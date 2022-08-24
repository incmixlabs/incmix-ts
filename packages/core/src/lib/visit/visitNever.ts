import ts from "typescript";

import { Visiter } from "../helpers/types";

export const visitNever: Visiter<ts.KeywordTypeNode> = () =>
  ts.factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword);
