import { Failable, FileOutput, Id } from "@ts-r/core";
import { setupTestDir } from "@ts-r/core/__tests__/helpers/testFileIO";

import { cli } from "../src/cli";

const blankTestFileIO: FileOutput = {
  write() {
    return Failable.success(undefined);
  },
};

const cliTestID = "the-id";
const testIdGenerator: Id = {
  generateId() {
    return cliTestID;
  },
};

describe(cli, () => {
  setupTestDir();
  it("Should print help if passed the help flag", () => {
    let logs = "";
    let errors = "";
    let exited = false;

    console.log("Running CLI");
    expect(
      cli({
        deps: {
          commanderProgram: {
            exitOverride() {
              exited = true;
            },
          },
          fileOutput: blankTestFileIO,
          args: {
            getArgs() {
              return ["-h"];
            },
            startsOnActualArguments: true,
          },
          logger: {
            log(text) {
              logs += `${text}\n`;
            },
            error(text) {
              errors += `${text}\n`;
            },
          },
          id: testIdGenerator,
        },
      })
    );

    expect(errors).toBe("");
    expect(logs.includes("Usage: ")).toBeTruthy();
    expect(logs.includes(""));
    expect(exited).toBe(true);
  });

  test.todo("ADD MANY MORE TESTS");
});
