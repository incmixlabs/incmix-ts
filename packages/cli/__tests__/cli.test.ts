import { Failable, FileOutput, fileOutput, Id } from "@ts-r/core";
import {
  appendToTest,
  readTest,
  setupTestDir,
  wrapInTestDir,
  writeTest,
} from "@ts-r/core/__tests__/helpers/testFileIO";

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

  it("Should auto-compile when a watch file changes", async () => {
    // Create the file to be watched
    const watchFile = wrapInTestDir("watch.tsr.ts");
    const watchFileOutput = wrapInTestDir("watch.tsr.o.ts");
    writeTest(watchFile, "export type T = 1;");

    // Watch the file
    let logs = "";
    let errors = "";
    let exited = false;
    cli({
      deps: {
        commanderProgram: {
          exitOverride() {
            exited = true;
          },
        },
        fileOutput: fileOutput,
        args: {
          getArgs() {
            return ["-w", watchFile.getFullFilePath()];
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
    });

    // Ensure there aren't any errors while watching the file
    expect(errors).toBe("");
    expect(logs.includes(""));
    expect(exited).toBe(false);

    // Wait for the file to be written
    await new Promise((f) => setTimeout(f, 3000));

    // Validate the file that the cli compiled
    expect(readTest(watchFileOutput)).toBe(
      "export const T_$TSR = {\n" +
        `    id: "${cliTestID}",\n` +
        '    type: "literal",\n' +
        '    typeLiteral: "number",\n' +
        "    value: 1\n" +
        "} as const;\n"
    );

    // Make a change to the watched file
    appendToTest(watchFile, "\nexport type U = 2;");

    // Wait for the changes made to the file to propagate
    await new Promise((f) => setTimeout(f, 3000));

    // Ensure those changes were picked up by the file watcher
    expect(readTest(watchFileOutput)).toBe(
      "export const T_$TSR = {\n" +
        `    id: "${cliTestID}",\n` +
        '    type: "literal",\n' +
        '    typeLiteral: "number",\n' +
        "    value: 1\n" +
        "} as const;\n" +
        "export const U_$TSR = {\n" +
        `    id: "${cliTestID}",\n` +
        '    type: "literal",\n' +
        '    typeLiteral: "number",\n' +
        "    value: 2\n" +
        "} as const;\n"
    );
  });

  test.todo("ADD MANY MORE TESTS");
});
