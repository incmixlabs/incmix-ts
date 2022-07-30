import ts from "typescript";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";
import {resolveReference} from "../resolve/resolveReference";

export const visitTypeReference: Visiter<ts.TypeReferenceNode> = ({
  node,
  metadata,
  deps,
}) => {
    // Resolve the reference and then visit it
    return visit({node: resolveReference(node), deps});
};
