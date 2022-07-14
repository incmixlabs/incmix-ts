import { transform } from "../src";
import { Id } from "../src/Id";
import prettier from "prettier";

const TEST_ID_GENERATED = "the-id-is-here";
const testId: Id = {
  generateId() {
    return TEST_ID_GENERATED;
  },
};

const format = (code: string) =>
  prettier.format(code, { parser: "typescript" });

const basicTypeCheck = (name: string) => {
  it(`Properly handles the ${name} type`, () => {
    expect(
      format(
        transform(
          {
            filename: `${name}.tsr`,
            text: `export type Type = ${name};`,
            outputFilename: `${name}.tsr.ts`,
          },
          { id: testId }
        ).trim()
      )
    ).toBe(
      format(
        `export const Type_$TSR = { id: "${TEST_ID_GENERATED}", type: "${name}" };`
      )
    );
  });
};

describe(transform, () => {
  basicTypeCheck("string");
  basicTypeCheck("number");
  basicTypeCheck("unknown");
  basicTypeCheck("any");
  basicTypeCheck("boolean")
});
