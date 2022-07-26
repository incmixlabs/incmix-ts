import * as ts from "typescript";
import fs from "fs";
import {visit} from "./lib/visit/visit";
import {Id} from "./deps/Id";
import {Failable} from "./Failable";

var ctx: ts.TransformationContext;
const fileExt = ".ts";

function insertTSRCode(transformResult: ts.SourceFile, sourceFile: ts.SourceFile): ts.Node {
    // Find the index at which the source file's code should be inserted into the transformed file
    const index = sourceFile.statements.findIndex(node =>
        node.kind !== ts.SyntaxKind.ImportDeclaration
    );

    // Nothing is to be done if the file contains only import statements, so return
    if (index === -1) return transformResult;

    // Filter out import statements from source file
    const sourceCode = sourceFile.statements.filter(node =>
        node.kind !== ts.SyntaxKind.ImportDeclaration
    );

    // Insert those nodes at the above specified index into the transform result file
    return ts.factory.createSourceFile(
        transformResult.statements.slice(0, index)
            .concat(sourceCode)
            .concat(transformResult.statements.slice(index)),
        transformResult.endOfFileToken,
        transformResult.flags
    ) as ts.Node;
}

export function transform(
    params: { filename: string; text: string; outputFilename: string, prependTsCode: boolean },
    deps: { id: Id }
): Failable.Type<string> {
    const sourceFile = ts.createSourceFile(
        params.filename,
        params.text,
        ts.ScriptTarget.Latest
    );

    const resultFile = ts.createSourceFile(
        params.outputFilename,
        "",
        ts.ScriptTarget.Latest,
        /*setParentNodes*/ false,
        ts.ScriptKind.TS
    );

    const transformResult = visit({deps, node: sourceFile});
    const prependedResult = params.prependTsCode ?
        insertTSRCode(transformResult as ts.SourceFile, sourceFile)
        : transformResult;
    const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed});
    const text = printer.printNode(
        ts.EmitHint.Unspecified,
        prependedResult,
        resultFile
    );

    return Failable.success(text);
}

function createTsRuntimeFile(filename: string, text: string) {
    const file = filename + fileExt;

    fs.writeFileSync(file, text);
}
