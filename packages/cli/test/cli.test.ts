import { cli } from "../src/cli";
import { FileOutput } from "../src/deps/FileOutput";
import { Failable } from "../src/Failable";
import prettier from "prettier";
import { Id } from "../src/deps/Id";
import {setupTestDir, wrapInTestDir, writeTest} from "./helpers/testFileIO";
import {getFullFilePath} from "./helpers/Path";

const format = (code: string) =>
  prettier.format(code, { parser: "typescript" });
const blankTestFileIO: FileOutput = {
  write(p) {
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

  it("Should correctly write the output to files when all passed",  () => {
    let logs = "";
    let errors = "";
    let exited = false;
    let writeCount = 0;

    const inputFileName = wrapInTestDir("abc1.tsr.ts");
    const outputFileName = wrapInTestDir("xyz1.tsr.ts");

    writeTest(inputFileName, `export type Type = number;`);

    cli({
      deps: {
        fileOutput: {
          write({ filePath, text }) {
            expect(filePath).toBe(getFullFilePath(outputFileName));
            expect(format(text)).toBe(
              format(`export const Type_$TSR = {id: "${cliTestID}", type: "number" }`)
            );
            writeCount ++;
            return Failable.success(undefined);
          },
        },
        args: {
          startsOnActualArguments: true,
          getArgs() {
            return [getFullFilePath(inputFileName), "-o", getFullFilePath(outputFileName)];
          },
        },
        commanderProgram: {
          exitOverride(err) {
            exited = true;
          },
        },
        logger: {
          error(text) {
            errors += `${text}\n`;
          },
          log(text) {
            logs += `${text}\n`;
          },
        },
        id: testIdGenerator,
      },
    });

    expect(errors).toBe("");
    expect(exited).toBe(false);
    expect(writeCount).toBe(1);
  });

  const testPrependFlag = (prepend: boolean) => () => {
    let logs = "";
    let errors = "";
    let exited = false;

    const inputFileName = wrapInTestDir("abc3.tsr.ts");
    const outputFileName = wrapInTestDir("xyz3.tsr.ts");

    writeTest(inputFileName, `export type X = 1;`);

    cli({
      deps: {
        fileOutput: {
          write({ text }) {
            expect(format(text)).toBe(
                format(prepend ? "export type X = 1;\n" : "" +
                    "export const X_$TSR = {\n" +
                    `    id: \"${cliTestID}\",\n` +
                    "    type: \"literal\",\n" +
                    "    typeLiteral: \"number\",\n" +
                    "    value: 1\n" +
                    "}")
            );
            return Failable.success(undefined);
          },
        },
        args: {
          startsOnActualArguments: true,
          getArgs() {
            return [getFullFilePath(inputFileName), "-p"];
          },
        },
        commanderProgram: {
          exitOverride(err) {
            exited = true;
          },
        },
        logger: {
          error(text) {
            errors += `${text}\n`;
          },
          log(text) {
            logs += `${text}\n`;
          },
        },
        id: testIdGenerator,
      },
    });

    expect(errors.length === 0).toBe(true);
  }

  it("Should prepend code from tsr file (when -p flag is passed)", testPrependFlag(true));
  it("Shouldn't prepend code from tsr file (when -p flag is not passed)", testPrependFlag(false));

  it.todo(
    "Should simply log the result if the -o flag is not passed and shouldn't perform any file writes"
  );
});
