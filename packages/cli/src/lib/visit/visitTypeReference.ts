import ts from "typescript";
import { Visiter } from "../helpers/types";
import { visit } from "./visit";
import {resolve} from "../resolve/resolve";
import { checker } from "../../transform";

export const visitTypeReference: Visiter<ts.TypeReferenceNode> = ({
  node,
  metadata,
  deps,
}) => {
    // Resolve the reference and then visit it
    return visit({node: resolve(node), deps});
};
