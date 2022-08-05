import ts from "typescript";
import {Visiter} from "../helpers/types";

export const visitEmptyStatement: Visiter<ts.EmptyStatement> = ({node, metadata}) => {
    return ts.factory.createEmptyStatement();
}