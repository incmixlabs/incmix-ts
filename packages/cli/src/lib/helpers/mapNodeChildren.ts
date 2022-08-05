import ts from "typescript";

export const mapNodeChildren = (node: ts.Node, fn: (node: ts.Node) => ts.Node) => {
    const children: ts.Node[] = [];
    node.forEachChild(cNode => {
        children.push(fn(cNode));
    });

    return children;
}