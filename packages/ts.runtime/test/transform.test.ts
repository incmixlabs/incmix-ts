import {transform} from "../src";
import {Id} from "../src/Id";
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
        output: `export const Type_$TSR = { id: "${TEST_ID_GENERATED}", type: "${name}" };`
    });
};

const genericTypeChecker = ({name, input, output}: { name: string, input: string, output: string }) => {
    it(`Properly handles the ${name} type`, () => {
        const filename = `${TEST_DIR}${path.sep}${name}.tsr.ts`;
        // Populate test file with input
        fs.writeFileSync(filename, input);

        const transformResult = transform(
            {
                filename,
                outputFilename: `${filename}.output.ts`,
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

const runTests = () => {
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
};

describe(transform, () => {
    setupTestDir();
    runTests();
    // teardownTestDir(); TODO include this
});


