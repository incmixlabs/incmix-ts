import ts from "typescript";
import {Visiter} from "../helpers/types";
import {visit} from "./visit";
import {resolve} from "../resolve/resolve";

export const visitTypeQuery: Visiter<ts.TypeQueryNode> = ({node, metadata, deps}) => {
    // Resolve the reference and then visit it
    return visit({node: resolve(node), deps});
};
