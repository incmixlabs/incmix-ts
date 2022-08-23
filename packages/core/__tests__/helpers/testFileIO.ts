import fs from "fs";
import path = require("path");

import Path from "../../src/Path";

export const TEST_DIR = "TEMP_TEST_DIR";

export const setupTestDir = () => {
  // Create an empty temporary test directory
  if (!fs.existsSync(TEST_DIR)) fs.mkdirSync(TEST_DIR);
};

export const createTestDir = (subDir: string) => {
  subDir = `${TEST_DIR}${path.sep}${subDir}`;
  if (!fs.existsSync(subDir)) fs.mkdirSync(subDir);
};

export const writeTest = (filePath: Path, input: string) =>
  fs.writeFileSync(filePath.getFullFilePath(), input);

export const appendToTest = (filePath: Path, data: string) =>
  fs.appendFileSync(filePath.getFullFilePath(), data);

export const readTest = (filePath: Path) =>
  fs.readFileSync(filePath.getFullFilePath()).toString();

export const wrapInTestDir = (filename: string) => new Path(filename, TEST_DIR);

export const teardownTestDir = () => {
  fs.rmdirSync(TEST_DIR, { recursive: true });
};
