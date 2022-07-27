import {transform} from "../src";
import {Id} from "../src/deps/Id";
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
        output: `export const Type_$TSR = { id: "${TEST_ID_GENERATED}", type: "${name}" };`,
        prependTsCode: false
    });
};

const genericTypeChecker = ({name, input, output, prependTsCode}: { name: string, input: string, output: string, prependTsCode: boolean }) => {
    it(`Properly handles the ${name} type`, () => {
        const transformResult = transform(
            {
                filename: `${name}.tsr`,
                text: input,
                outputFilename: `${name}.tsr.ts`,
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

describe(transform, () => {
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
});


