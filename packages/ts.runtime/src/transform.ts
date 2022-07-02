import * as ts from "typescript";
import fs from "fs";
import { getTransformerFactory } from "./factory";

var strBuilder = "";
var generics = {} as any;
var types = {} as any;

const enums = {} as any;

var ctx: ts.TransformationContext;
const fileExt = ".ts";

export function transform(filename: string): string {
  // const program = ts.createProgram([filename], {});
  // const sourceFile = program.getSourceFile(filename)!;
  resetValues();
  const code = fs.readFileSync(filename, "utf8");
  const sourceFile = ts.createSourceFile(
    filename,
    code,
    ts.ScriptTarget.Latest
  );

  return printNode(
    sourceFile,
    getTransformerFactory((_ctx: ts.TransformationContext) => (ctx = _ctx)),
    filename
  );
}

export function transformFromSource(source: string, fileName = "") {
  resetValues();
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest
  );
  return printNode(
    sourceFile,
    getTransformerFactory((_ctx: ts.TransformationContext) => (ctx = _ctx)),
    fileName,
    false
  );
}

export function transformTypings(source: string) {
  resetValues();

  const fileName = "";
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest
  );
  printNode(
    sourceFile,
    getTransformerFactory(
      (_ctx: ts.TransformationContext) => (ctx = _ctx),
      true
    ),
    fileName,
    false
  );

  let str = "";

  for (const key in types) {
    if (types.hasOwnProperty(key)) {
      str += `type ${key} = any;\n`;
      str += `export const ${key}: ${key};\n`;
    }
  }
  return str;
}

function visit(node: ts.Node): ts.Node {
  if (node.kind === ts.SyntaxKind.TypeKeyword) {
    console.log("Found TypeKeyword");
    return ts.factory.createToken(ts.SyntaxKind.ConstKeyword);
  }

  if (node.kind === ts.SyntaxKind.TypeLiteral) {
    return visitTypeLiteral(node);
  }

  if (node.kind === ts.SyntaxKind.UnionType) {
    return visitUnionType(node);
  }

  if (node.kind === ts.SyntaxKind.LiteralType) {
    return visitLiteralType(node);
  }

  if (node.kind === ts.SyntaxKind.BooleanKeyword) {
    return visitBooleanKeyWord(node);
  }

  if (node.kind === ts.SyntaxKind.StringKeyword) {
    return visitStringKeyword(node);
  }

  if (node.kind === ts.SyntaxKind.PropertySignature) {
    return visitPropertySignature(node);
  }

  if (node.kind === ts.SyntaxKind.NumberKeyword) {
    return visitNumberKeyword(node);
  }

  if (node.kind === ts.SyntaxKind.Identifier) {
    return visitIdentifier(node);
  }

  if (node.kind === ts.SyntaxKind.NumericLiteral) {
    return visitNumericLiteral(node);
  }

  if (node.kind === ts.SyntaxKind.StringLiteral) {
    return visitStringLiteral(node);
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return visitTrueKeyword(node);
  }

  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return visitFalseKeyword(node);
  }

  if (node.kind === ts.SyntaxKind.TypeReference) {
    return visitTypeReference(node);
  }

  if (node.kind === ts.SyntaxKind.FunctionType) {
    return visitFunctionType(node);
  }

  if (node.kind === ts.SyntaxKind.EnumDeclaration) {
    return visitEnumDeclaration(node, ctx);
  }

  return node;
}

export function visitTypeAliasDeclaration(
  node: ts.Node,
  context: ts.TransformationContext,
  addSourceText: boolean
): ts.Node {
  let str = "";
  let typeName = "";
  strBuilder += "\n\nexport const ";

  const childNode = ts.visitEachChild(
    node,
    (_node: ts.Node): ts.Node => {
      if (_node.kind === ts.SyntaxKind.Identifier) {
        const n = _node as ts.Identifier;
        const nodeText = n.escapedText.toString() + "_$TSR";

        return ts.factory.createIdentifier(nodeText);
      }

      if (_node.kind === ts.SyntaxKind.TypeKeyword) {
        console.log("Found TypeKeyword");
        return ts.factory.createToken(ts.SyntaxKind.ConstKeyword);
      }

      if (_node.kind === ts.SyntaxKind.TypeParameter) {
        return _node;
      }

      const visitNode = visit(_node);
      return visitNode;
    },
    context
  );

  if (str.length > 0) {
    let part1 = strBuilder.slice(0, strBuilder.length - 1) as string;
    let part2 = strBuilder.slice(strBuilder.length - 1, strBuilder.length);
    part1 += ",generics: {" + str + "},";
    part1 += part2;
    strBuilder = part1;
    str = "";
  }

  // strBuilder += " as const;\n";
  strBuilder += " \n";
  // addSourceText && (strBuilder += node.getFullText(node.getSourceFile()));
  types[typeName] = strBuilder;

  return childNode;
}

export function visitInterfaceDeclaration(
  node: ts.Node,
  context: ts.TransformationContext
) {
  strBuilder += "\n\nexport const TsRuntimeObject_";
  const childNode = ts.visitEachChild(
    node,
    (_node: ts.Node): ts.Node => {
      if (_node.kind === ts.SyntaxKind.Identifier) {
        const identifierNode = _node as ts.Identifier;
        strBuilder += identifierNode.escapedText + ": ";
        return identifierNode;
      } else {
        const visitNode = visit(_node);
        return visitNode;
      }
    },
    context
  );

  return childNode;
}

function visitTypeLiteral(node: ts.Node) {
  strBuilder += "{ type: 'object', properties: { ";
  const childNode = ts.visitEachChild(
    node,
    visit,
    ctx as ts.TransformationContext
  );
  strBuilder += "} }";
  return childNode;
}

function visitPropertySignature(node: ts.Node) {
  const childNode = ts.visitEachChild(
    node,
    (node: ts.Node): ts.Node => {
      if (node.kind === ts.SyntaxKind.Identifier) {
        const identifierNode = node as ts.Identifier;
        strBuilder += identifierNode.escapedText + ": ";

        return identifierNode;
      } else {
        return visit(node);
      }
    },
    ctx as ts.TransformationContext
  );
  strBuilder += ",";
  return childNode;
}

function visitLiteralType(node: ts.Node) {
  const cNode = ts.visitEachChild(
    node,
    (node: ts.Node): ts.Node => {
      strBuilder += `{ type: 'primitive`;
      strBuilder += "', value: ";
      return visit(node);
    },
    ctx
  );
  strBuilder += " }";
  return cNode;
}

function visitUnionType(node: ts.Node) {
  strBuilder += `{
    type: "union",
    values: [
  `;
  const childNode = ts.visitEachChild(
    node,
    (node: ts.Node): ts.Node => {
      const cNode = visit(node);
      strBuilder += ",";
      return cNode;
    },
    ctx as ts.TransformationContext
  );
  strBuilder += `]}`;
  return childNode;
}

function visitTypeReference(node: ts.Node) {
  strBuilder += "{ type: '";

  const cNode = ts.visitEachChild(
    node,
    (_node: ts.Node): ts.Node => {
      if (_node.kind === ts.SyntaxKind.Identifier) {
        const n = _node as ts.Identifier;
        const escapedText = n.escapedText.toString();

        if (generics[escapedText]) {
          strBuilder += "generic', value: '" + escapedText + "'";
        }
        if (enums[escapedText]) {
          strBuilder += "enum', value: " + enums[escapedText];
        } else {
          strBuilder += escapedText;
          strBuilder += "', value: ";
        }
      } else {
        return visit(_node);
      }
      return _node;
    },
    ctx
  );
  strBuilder += "}";
  return cNode;
}

function visitFunctionType(node: ts.Node) {
  strBuilder += "{ type: 'function', parameters: {";
  let str = "";

  const cNode = ts.visitEachChild(
    node,
    (_node: ts.Node): ts.Node => {
      if (_node.kind === ts.SyntaxKind.Parameter) {
        const parameterNode = ts.visitEachChild(
          _node,
          (__node: ts.Node): ts.Node => {
            if (__node.kind === ts.SyntaxKind.Identifier) {
              const n = __node as ts.Identifier;
              strBuilder += n?.escapedText + ":";
            } else {
              return visit(__node);
            }
            return __node;
          },
          ctx
        );
        strBuilder += ",";
        return parameterNode;
      } else if (_node.kind === ts.SyntaxKind.TypeParameter) {
        const typeParamNode = ts.visitEachChild(
          _node,
          (node: ts.Node): ts.Node => {
            if (node.kind === ts.SyntaxKind.Identifier) {
              const n = node as ts.Identifier;
              const escapedText = n.escapedText.toString();
              str +=
                escapedText.toLocaleLowerCase() + ":'" + escapedText + "',";
              generics[escapedText] = n.escapedText;
              return node;
            }
            return node;
          },
          ctx
        );
        return typeParamNode;
      } else {
        strBuilder += "}, returns: ";
        const _pNode = visit(_node);
        // strBuilder += "";
        return _pNode;
      }
    },
    ctx
  );

  if (str.length > 0) {
    let part1 = strBuilder.slice(0, strBuilder.length - 1) as string;
    let part2 = strBuilder.slice(strBuilder.length - 1, strBuilder.length);
    part1 += ",generics: {" + str + "},";
    part1 += part2;
    strBuilder = part1;
    str = "";
  }
  strBuilder += "}";
  return cNode;
}

function visitBooleanKeyWord(node: ts.Node) {
  strBuilder += "{ type: 'boolean' }";
  return node;
}

function visitStringKeyword(node: ts.Node) {
  strBuilder += "{ type: 'string' }";
  return node;
}

function visitNumberKeyword(node: ts.Node) {
  strBuilder += "{ type: 'number' }";
  return node;
}

function visitIdentifier(node: ts.Node) {
  // strBuilder += node.getText();
  return node;
}

function visitNumericLiteral(node: ts.Node) {
  const n = node as ts.NumericLiteral;
  strBuilder += n.text;
  return node;
}

function visitStringLiteral(node: ts.Node) {
  const n = node as ts.StringLiteral;
  strBuilder += `"${n.text}"`;
  return node;
}

function visitTrueKeyword(node: ts.Node) {
  strBuilder += node.getText();
  return node;
}

function visitFalseKeyword(node: ts.Node) {
  strBuilder += node.getText();
  return node;
}

export function visitEnumDeclaration(
  node: ts.Node,
  context: ts.TransformationContext
) {
  let str = "{ type: 'enum', values: [";
  let identifierName = "";
  const cNode = ts.visitEachChild(
    node,
    (_node: ts.Node): ts.Node => {
      if (_node.kind === ts.SyntaxKind.Identifier) {
        const n = _node as ts.Identifier;
        const escapedText = n.escapedText.toString();

        // add to enums object
        identifierName = escapedText;
        enums[escapedText] = null;
      }
      if (_node.kind === ts.SyntaxKind.EnumMember) {
        const n = _node as ts.EnumMember;
        str += "{";
        const __node = ts.visitEachChild(
          n,
          (node: ts.Node): ts.Node => {
            if (node.kind === ts.SyntaxKind.Identifier) {
              const n = node as ts.Identifier;
              const escapedText = n.escapedText.toString();
              str += "name:'" + escapedText + "',";
            }
            if (node.kind === ts.SyntaxKind.NumericLiteral) {
              const n = node as ts.NumericLiteral;
              str += "type: 'number', value:'" + n.text + "',";
            }
            if (node.kind === ts.SyntaxKind.StringLiteral) {
              const n = node as ts.StringLiteral;
              str += "type: 'string', value: '" + n.text + "',";
            }
            return node;
          },
          context
        );
        str += "},";
        return __node;
      }
      return _node;
    },
    context
  );
  str += "]}";
  enums[identifierName] = str;
  return cNode;
}

function printNode(
  sourceFile: ts.SourceFile,
  transformerFactory: ts.TransformerFactory<ts.Node>,
  filename: string,
  canWriteFile: boolean = true
) {
  const transformResult = ts.transform(sourceFile, [transformerFactory]);

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const resultFile = ts.createSourceFile(
    "someFileName.ts",
    "",
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS
  );

  const text = printer.printNode(
    ts.EmitHint.Unspecified,
    transformResult.transformed[0],
    resultFile
  );

  canWriteFile && createTsRuntimeFile(filename, text);

  return text;
}

function createTsRuntimeFile(filename: string, text: string) {
  const file = filename + fileExt;

  fs.writeFileSync(file, text);
}

function resetValues() {
  strBuilder = "";
  generics = {};
  types = {};
}
