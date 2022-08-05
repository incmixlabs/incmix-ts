import fs from "fs";
import {getFullFilePath, Path, wrap} from "./Path";

export const TEST_DIR = "TEMP_TEST_DIR";

export const setupTestDir = () => {
    // Create an empty temporary test directory
    if (fs.existsSync(TEST_DIR))
        fs.rmdirSync(TEST_DIR, {recursive: true})
    fs.mkdirSync(TEST_DIR);
};

export const writeTest = (filePath: Path, input: string) =>
    fs.writeFileSync(getFullFilePath(filePath), input);

export const wrapInTestDir = (filename: string) =>
    wrap(filename, TEST_DIR);

export const teardownTestDir = () => {
    fs.rmdirSync(TEST_DIR, {recursive: true})
};