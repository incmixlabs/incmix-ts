import { Failable, FileOutput, fileOutput, Id } from "@ts-r/core";
import {
  appendToTest,
  createTestDir,
  readTest,
  setupTestDir,
  wrapInTestDir,
  writeTest,
} from "@ts-r/core/__tests__/helpers/testFileIO";
import path = require("path");

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

  it("Should auto-compile when a watched directory has changes", async () => {
    type file = {
      readonly name: string;
      readonly content: string | readonly file[];
    };
    const writeTestDir = (testFile: file, dir?: string) => {
      if (typeof testFile.content === "string") {
        // file is not a directory, so write it at the current directory
        writeTest(
          wrapInTestDir(`${dir}${path.sep}${testFile.name}`),
          testFile.content
        );
      } else {
        // file is a directory - so create it, walk the kids and append this directory
        createTestDir(
          dir === undefined
            ? testFile.name
            : `${dir}${path.sep}${testFile.name}`
        );
        testFile.content.forEach((subFile) =>
          writeTestDir(
            subFile,
            dir === undefined
              ? testFile.name
              : `${dir}${path.sep}${testFile.name}`
          )
        );
      }
    };
    const compareTestDir = (expectedFile: file, dir?: string) => {
      if (typeof expectedFile.content === "string") {
        // file is not a directory, so compare the actual file's contents
        // against the expected file's contents
        expect(
          readTest(wrapInTestDir(`${dir}${path.sep}${expectedFile.name}`))
        ).toBe(expectedFile.content);
      } else {
        // file is a directory - so walk the kids, append this directory
        // and validate each child
        expectedFile.content.forEach((subFile) =>
          compareTestDir(
            subFile,
            dir === undefined
              ? expectedFile.name
              : `${dir}${path.sep}${expectedFile.name}`
          )
        );
      }
    };

    const testDirName = "watch_dir";

    const watchDir: file = {
      name: testDirName,
      content: [
        {
          name: "file1.tsr.ts",
          content: "export type T = {a: string;};",
        },
        {
          name: "file2.tsr.ts",
          content: "export type U = {c: boolean;};",
        },
        {
          name: "dir1",
          content: [
            {
              name: "dir1file1.tsr.ts",
              content: "export type S = {b: number;};",
            },
          ],
        },
      ],
    };
    const additionalDir: file = {
      name: `${testDirName}${path.sep}dir1${path.sep}dir2`,
      content: [
        {
          name: "dir1dir2file1.tsr.ts",
          content: "export type K = {l: string;};",
        },
      ],
    };

    const outDirPre: file = {
      name: testDirName,
      content: [
        {
          name: "file1.tsr.o.ts",
          content:
            "export const T_$TSR = {\n" +
            `    id: "${cliTestID}",\n` +
            '    type: "object",\n' +
            "    properties: {\n" +
            "        a: {\n" +
            '            type: "propertySignature",\n' +
            "            optional: false,\n" +
            `            tsRuntimeObject: { id: "${cliTestID}", type: "string" }\n` +
            "        }\n" +
            "    }\n" +
            "} as const;\n",
        },
        {
          name: "file2.tsr.o.ts",
          content:
            "export const U_$TSR = {\n" +
            `    id: "${cliTestID}",\n` +
            '    type: "object",\n' +
            "    properties: {\n" +
            "        c: {\n" +
            '            type: "propertySignature",\n' +
            "            optional: false,\n" +
            `            tsRuntimeObject: { id: "${cliTestID}", type: "boolean" }\n` +
            "        }\n" +
            "    }\n" +
            "} as const;\n",
        },
        {
          name: "dir1",
          content: [
            {
              name: "dir1file1.tsr.o.ts",
              content:
                "export const S_$TSR = {\n" +
                `    id: "${cliTestID}",\n` +
                '    type: "object",\n' +
                "    properties: {\n" +
                "        b: {\n" +
                '            type: "propertySignature",\n' +
                "            optional: false,\n" +
                `            tsRuntimeObject: { id: "${cliTestID}", type: "number" }\n` +
                "        }\n" +
                "    }\n" +
                "} as const;\n",
            },
          ],
        },
      ],
    };
    const outDirPost: file = {
      name: testDirName,
      content: [
        {
          name: "file1.tsr.o.ts",
          content:
            "export const T_$TSR = {\n" +
            `    id: "${cliTestID}",\n` +
            '    type: "object",\n' +
            "    properties: {\n" +
            "        a: {\n" +
            '            type: "propertySignature",\n' +
            "            optional: false,\n" +
            `            tsRuntimeObject: { id: "${cliTestID}", type: "string" }\n` +
            "        }\n" +
            "    }\n" +
            "} as const;\n",
        },
        {
          name: "file2.tsr.o.ts",
          content:
            "export const U_$TSR = {\n" +
            `    id: "${cliTestID}",\n` +
            '    type: "object",\n' +
            "    properties: {\n" +
            "        c: {\n" +
            '            type: "propertySignature",\n' +
            "            optional: false,\n" +
            `            tsRuntimeObject: { id: "${cliTestID}", type: "boolean" }\n` +
            "        }\n" +
            "    }\n" +
            "} as const;\n",
        },
        {
          name: "dir1",
          content: [
            {
              name: "dir1file1.tsr.o.ts",
              content:
                "export const S_$TSR = {\n" +
                `    id: "${cliTestID}",\n` +
                '    type: "object",\n' +
                "    properties: {\n" +
                "        b: {\n" +
                '            type: "propertySignature",\n' +
                "            optional: false,\n" +
                `            tsRuntimeObject: { id: "${cliTestID}", type: "number" }\n` +
                "        }\n" +
                "    }\n" +
                "} as const;\n",
            },
            {
              name: "dir2",
              content: [
                {
                  name: "dir1dir2file1.tsr.o.ts",
                  content:
                    "export const K_$TSR = {\n" +
                    `    id: "${cliTestID}",\n` +
                    '    type: "object",\n' +
                    "    properties: {\n" +
                    "        l: {\n" +
                    '            type: "propertySignature",\n' +
                    "            optional: false,\n" +
                    `            tsRuntimeObject: { id: "${cliTestID}", type: "string" }\n` +
                    "        }\n" +
                    "    }\n" +
                    "} as const;\n",
                },
              ],
            },
          ],
        },
      ],
    };

    // Write watchDir test files
    writeTestDir(watchDir);

    // Run CLI on watchDir
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
            return ["-w", wrapInTestDir(testDirName).getFullFilePath()];
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

    // Wait for the file to be written
    await new Promise((f) => setTimeout(f, 3000));

    // Ensure that the cli ran without error and didn't exit prematurely
    expect(errors).toBe("");
    expect(logs).toBe("");
    expect(exited).toBe(false);

    // Ensure that the watcher generated all the files currently in the directory
    compareTestDir(outDirPre);

    // Write the additional directory
    writeTestDir(additionalDir);

    // Wait for the watcher to compile the new directory
    await new Promise((f) => setTimeout(f, 10000));

    // Ensure that the watcher noticed and generated the new directory
    compareTestDir(outDirPost);
  });

  test.todo("ADD MANY MORE TESTS");
});
