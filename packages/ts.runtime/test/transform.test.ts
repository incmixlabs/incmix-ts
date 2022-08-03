import {transform} from "../src";
import {Id} from "../src/deps/Id";
import prettier from "prettier";
import {Failable} from "../src/Failable";
import fs from "fs";
import path from "path";

const TEST_ID_GENERATED = "the-id-is-here";
const TEST_DIR = "TEMP_TEST_DIR";

const testId: Id = {
    generateId() {
        return TEST_ID_GENERATED;
    },
};

const format = (code: string) =>
    prettier.format(code, {parser: "typescript"});

const basicTypeCheck = (name: string) => {
    genericTypeChecker({
        name: name,
        input: `export type Type = ${name};`,
        output: `export const Type_$TSR = { id: "${TEST_ID_GENERATED}", type: "${name}" };`,
        prependTsCode: false
    });
};

const genericTypeChecker = ({name, input, output, prependTsCode}: { name: string, input: string, output: string, prependTsCode: boolean }) => {
    it(`Properly handles the ${name} type`, () => {
        const filename = `${TEST_DIR}${path.sep}${name}.tsr.ts`;
        // Populate test file with input
        fs.writeFileSync(filename, input);

        const transformResult = transform(
            {
                filename,
                outputFilename: `${filename}.output.ts`,
                prependTsCode
            },
            {id: testId}
        );

        expect(transformResult.type).toBe("success");
        const transformSuccess = transformResult as Failable.Success<string>;

        expect(format(transformSuccess.value.trim())).toBe(
            format(output)
        );
    });
};

const setupTestDir = () => {
    // Create an empty temporary test directory
    if (fs.existsSync(TEST_DIR))
        fs.rmdirSync(TEST_DIR, {recursive: true})
    fs.mkdirSync(TEST_DIR);
};

const teardownTestDir = () => {
    fs.rmdirSync(TEST_DIR, {recursive: true})
};

const basicTypeRefCheck = (name: string) => {
    genericTypeChecker({
        name: `Type Reference Primitive - ${name}`,
        input: `type A = ${name};\nexport type B = A`,
        output: `export const B_$TSR = { id: "${TEST_ID_GENERATED}", type: "${name}" };`,
        prependTsCode: false
    });
}

const basicTypeRefLiteralCheck = (name: string, literal: string) => {
    genericTypeChecker({
        name: `Type Reference Primitive Literal - ${name} ${literal}`,
        input: `type A = ${literal};\nexport type B = A`,
        output: `export const B_$TSR = { id: "${TEST_ID_GENERATED}", type: "literal", typeLiteral: "${name}", value: ${literal} };`,
        prependTsCode: false
    });
}

// TODO REMOVE ME - Handy regex for replacing generated ids ([a-f0-9]){8}-(([a-f0-9]){4}-){3}([a-f0-9]){12}

const runTests = () => {
    /*** Visitor Tests ***/
    basicTypeCheck("string");
    basicTypeCheck("number");
    basicTypeCheck("unknown");
    basicTypeCheck("any");
    basicTypeCheck("boolean");
    genericTypeChecker({
        name: "enum",
        input: `export enum Enum {A, B = 2}`,
        output: `export const Enum_$TSR = {\n id: "${TEST_ID_GENERATED}",\n type: "enum",\n enum: Enum, };`,
        prependTsCode: false
    });

    genericTypeChecker({
        name: "prepend - true",
        input: `export type X = 1;`,
        output: "export type X = 1;\n" +
            "export const X_$TSR = {\n" +
            `    id: \"${TEST_ID_GENERATED}\",\n` +
            "    type: \"literal\",\n" +
            "    typeLiteral: \"number\",\n" +
            "    value: 1\n" +
            "}",
        prependTsCode: true
    });
    genericTypeChecker({
        name: "prepend - false",
        input: `export type X = 1;`,
        output: "export const X_$TSR = {\n" +
            `    id: \"${TEST_ID_GENERATED}\",\n` +
            "        type: \"literal\",\n" +
            "        typeLiteral: \"number\",\n" +
            "        value: 1\n" +
            "    }",
        prependTsCode: false
    });
    genericTypeChecker({
        name: "unique symbol",
        input: `export type UniqueSymbol = { readonly A: unique symbol; }`,
        output: "export const UniqueSymbol_$TSR = {\n" +
            `    id: \"${TEST_ID_GENERATED}\",\n` +
            "    type: \"object\",\n" +
            "    properties: {\n" +
            "        A: {\n" +
            "            type: \"propertySignature\",\n" +
            "            optional: false,\n" +
            "            tsRuntimeObject: {\n" +
            `                id: \"${TEST_ID_GENERATED}\",\n` +
            "                type: \"unique symbol\",\n" +
            "                uniqueSymbolTypeId: Symbol()\n" +
            "            }\n" +
            "        }\n" +
            "    }\n" +
            "};\n",
        prependTsCode: false
    });
    genericTypeChecker({
        name: "readonly tuple",
        input: "export type ReadOnlyTuple = {\n" +
            "    A: readonly [string];\n" +
            "};",
        output: "export const ReadOnlyTuple_$TSR = {\n" +
            `    id: \"${TEST_ID_GENERATED}\",\n` +
            "    type: \"object\",\n" +
            "    properties: {\n" +
            "        A: {\n" +
            "            type: \"propertySignature\",\n" +
            "            optional: false,\n" +
            "            tsRuntimeObject: {\n" +
            `                id: \"${TEST_ID_GENERATED}\",\n` +
            "                type: \"tuple\",\n" +
            "                items: [\n" +
            "                    {\n" +
            "                        spread: false,\n" +
            "                        optional: false,\n" +
            `                        tsRuntimeObject: { id: \"${TEST_ID_GENERATED}\", type: \"string\" }\n` +
            "                    }\n" +
            "                ],\n" +
            "                itemsAreReadOnly: true\n" +
            "            }\n" +
            "        }\n" +
            "    }\n" +
            "};",
        prependTsCode: false
    });
    genericTypeChecker({
        name: "readonly array",
        input: "export type ReadOnlyArray = {\n" +
            "    A: readonly string[];\n" +
            "};",
        output: "export const ReadOnlyArray_$TSR = {\n" +
            `    id: \"${TEST_ID_GENERATED}\",\n` +
            "    type: \"object\",\n" +
            "    properties: {\n" +
            "        A: {\n" +
            "            type: \"propertySignature\",\n" +
            "            optional: false,\n" +
            "            tsRuntimeObject: {\n" +
            `                id: \"${TEST_ID_GENERATED}\",\n` +
            "                type: \"array\",\n" +
            `                items: { id: \"${TEST_ID_GENERATED}\", type: \"string\" },\n` +
            "                itemsAreReadOnly: true\n" +
            "            }\n" +
            "        }\n" +
            "    }\n" +
            "};",
        prependTsCode: false
    });

    /*** Resolver Tests ***/
    basicTypeRefCheck("any");
    basicTypeRefCheck("unknown");
    basicTypeRefCheck("string");
    basicTypeRefCheck("number");
    basicTypeRefCheck("boolean");
    basicTypeRefLiteralCheck("string", "\"text\"");
    basicTypeRefLiteralCheck("number", "5");
    basicTypeRefLiteralCheck("boolean", "true");
    genericTypeChecker({
        name: "Type Reference - union",
        input: `type A = number | string;\nexport type T = A;`,
        output: `export const T_$TSR = {\n id: "${TEST_ID_GENERATED}",\n` +
            " type: \"union\",\n values: [\n" +
            ` { id: \"${TEST_ID_GENERATED}\", type: \"string\" },\n` +
            ` { id: \"${TEST_ID_GENERATED}\", type: \"number\" },\n],\n}`,
        prependTsCode: false
    });
    genericTypeChecker({
        name: "Type Reference - intersection",
        input: `type A = {} & {a: ""};\nexport type T = A;`,
        output: "export const T_$TSR = {\n" +
            `    id: \"${TEST_ID_GENERATED}\",\n` +
            "    type: \"object\",\n" +
            "    properties: {\n" +
            "        a: {\n" +
            `            id: \"${TEST_ID_GENERATED}\",\n` +
            "            type: \"literal\",\n" +
            "            typeLiteral: \"string\",\n" +
            "            value: \"\"\n" +
            "        }\n" +
            "    }\n" +
            "};",
        prependTsCode: false
    });
    genericTypeChecker({
        name: "Type Reference - anonymous object",
        input: `type A = {};\nexport type T = A;`,
        output: "export const T_$TSR = {\n" +
            `    id: \"${TEST_ID_GENERATED}\",\n` +
            "    type: \"object\",\n" +
            "    properties: {}\n" +
            "};",
        prependTsCode: false
    });
    genericTypeChecker({
        name: "Type Reference - typeof",
        input: `let A: string;\nexport type T = typeof A;`,
        output: `export const T_$TSR = { id: "${TEST_ID_GENERATED}", type: "string" };`,
        prependTsCode: false
    });
};

describe(transform, () => {
    setupTestDir();
    runTests();
    // teardownTestDir(); TODO include this
});


