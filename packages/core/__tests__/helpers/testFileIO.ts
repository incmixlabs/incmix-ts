import * as fs from "fs";
import * as path from "path";

import { getFullFilePath, Path, wrap } from "../../src";

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
  fs.writeFileSync(getFullFilePath(filePath), input);

export const readTest = (filePath: Path) =>
  fs.readFileSync(getFullFilePath(filePath)).toString();

export const wrapInTestDir = (filename: string) => wrap(filename, TEST_DIR);

export const teardownTestDir = () => {
  fs.rmdirSync(TEST_DIR, { recursive: true });
};
