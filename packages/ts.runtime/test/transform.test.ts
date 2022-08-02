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
});


