import {transform} from "../src";
import {Id} from "../src/Id";
import prettier from "prettier";
import {Failable} from "../src/Failable";

const TEST_ID_GENERATED = "the-id-is-here";
const testId: Id = {
    generateId() {
        return TEST_ID_GENERATED;
    },
};

const format = (code: string) =>
    prettier.format(code, {parser: "typescript"});

const basicTypeCheck = (name: string) => {
    genericTypeChecker({
        name: "enum",
        input: `export type Type = ${name};`,
        output: `export const Type_$TSR = { id: "${TEST_ID_GENERATED}", type: "${name}" };`
    });
};

const genericTypeChecker = ({name, input, output}: { name: string, input: string, output: string }) => {
    it(`Properly handles the ${name} type`, () => {
        const transformResult = transform(
            {
                filename: `${name}.tsr`,
                text: input,
                outputFilename: `${name}.tsr.ts`,
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

describe(transform, () => {
    basicTypeCheck("string");
    basicTypeCheck("number");
    basicTypeCheck("unknown");
    basicTypeCheck("any");
    basicTypeCheck("boolean");
    genericTypeChecker({
        name: "enum",
        input: `export enum Enum {A, B = 2}`,
        output: `export const Enum_$TSR = {\n id: "${TEST_ID_GENERATED}",\n type: "enum",\n enum: Enum, };`
    });
    genericTypeChecker({
        name: "unique symbol",
        input: `export type UniqueSymbol = { readonly A: unique symbol; }`,
        output: "export const UniqueSymbol_$TSR = {\n" +
            `    id: \"${TEST_ID_GENERATED}\",\n` +
            "    type: \"object\",\n" +
            "    properties: {\n" +
            "        A: {\n" +
            `            id: \"${TEST_ID_GENERATED}\",\n` +
            "            type: \"unique symbol\",\n" +
            "            uniqueSymbolTypeId: Symbol(),\n" +
            "        },\n" +
            "    },\n" +
            "};"
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
            `            id: \"${TEST_ID_GENERATED}\",\n` +
            "            type: \"tuple\",\n" +
            "            items: [\n" +
            "                {\n" +
            "                    spread: false,\n" +
            "                    optional: false,\n" +
            `                    tsRuntimeObject: { id: \"${TEST_ID_GENERATED}\", type: \"string\" },\n` +
            "                },\n" +
            "            ],\n" +
            "            itemsAreReadOnly: true,\n" +
            "        },\n" +
            "    },\n" +
            "};\n"
    });
    genericTypeChecker({
        name: "readonly tuple",
        input: "export type ReadOnlyArray = {\n" +
            "    A: readonly string[];\n" +
            "};",
        output: "export const ReadOnlyArray_$TSR = {\n" +
            `    id: \"${TEST_ID_GENERATED}\",\n` +
            "    type: \"object\",\n" +
            "    properties: {\n" +
            "        A: {\n" +
            `            id: \"${TEST_ID_GENERATED}\",\n` +
            "            type: \"array\",\n" +
            `            items: { id: \"${TEST_ID_GENERATED}\", type: \"string\" },\n` +
            "            itemsAreReadOnly: true\n" +
            "        }\n" +
            "    }\n" +
            "};"
    });
});


