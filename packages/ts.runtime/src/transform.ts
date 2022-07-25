import * as ts from "typescript";
import fs from "fs";
import {visit} from "./lib/visit/visit";
import {Id} from "./deps/Id";
import {Failable} from "./Failable";

var ctx: ts.TransformationContext;
const fileExt = ".ts";

function insertTSRCode(transformResult: ts.SourceFile, sourceFile: ts.SourceFile): ts.Node {
    let i = 0;
    const statements: ts.Statement[] = [];
    const mustExclude = (node: ts.Node) =>
        ts.isImportDeclaration(node) ||
        ts.isExportDeclaration(node) ||
        ts.isExportAssignment(node) ||
        !!node.modifiers && !!node.modifiers.find(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)

    // Only include statements from the source file that are neither import nor export statements
    // as those statements will all have already been output into transformResult
    sourceFile.statements.forEach(statement => {
        // TODO Include the below statements if visit() include the ignored statements
        statements.push(mustExclude(statement) ? transformResult.statements[i] : statement);
        i++;
        // TODO Include the below statement if visit() excludes the ignored statements
        // statements.push(mustExclude(statement) ? transformResult.statements[i++] : statement);
    });

    return ts.factory.createSourceFile(
        statements,
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
