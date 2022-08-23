import {
  Failable,
  FileOutput,
  fileOutput,
  getFullFilePath,
  Id,
} from "@ts-r/core";
import {
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

  it("Should handle folder compilation", () => {
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

    const testDirName = "in_dir";

    const inDir: file = {
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
            {
              name: "dir2",
              content: [
                {
                  name: "dir1dir2file1.tsr.ts",
                  content: "export type K = {l: string;};",
                },
              ],
            },
          ],
        },
      ],
    };
    const outDir: file = {
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

    // Write inDir test files
    writeTestDir(inDir);

    // Run CLI on inDir
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
            return [getFullFilePath(wrapInTestDir(testDirName))];
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

    // Ensure that the cli ran without error and didn't exit prematurely
    expect(errors).toBe("");
    expect(logs).toBe("");
    expect(exited).toBe(false);

    // Compare outDir with
    compareTestDir(outDir);
  });

  test.todo("ADD MANY MORE TESTS");
});
