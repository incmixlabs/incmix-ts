import { transform } from "../transform";
import fs from "fs";

const FOLDERS_TO_EXCLUDE = ["node_modules", "dist"];

/**
 * __Description__: This will generate a ts runtime object from all files in a directory.
 * @param {string} dir e.g. "./test/test_src/a1/a2/a3"
 * @returns {string} e.g. "./test/test_src/a1/a2/a3/a3.ts"
 */

export function generateTSRuntimeObjectFromDir(
  dir: string = process.cwd()
): any {
  // var stats = fs.statSync(dir);
  // if (stats.isDirectory() && !FOLDERS_TO_EXCLUDE.includes(dir)) {
  //   const files = getFiles(dir);
  //   return files.map((file) => {
  //     const ext = file.split(".").pop();
  //     var fileStats = fs.statSync(`${dir}/${file}`);
  //     if (fileStats.isFile() && ext === "tsr") {
  //       return transform(`${dir}/${file}`);
  //     } else {
  //       return generateTSRuntimeObjectFromDir(`${dir}/${file}`);
  //     }
  //   });
  // } else if (stats.isFile() && dir.split(".").pop() === "tsr") {
  //   return generateTSRuntimeObjectFromFile(dir);
  // }
}

/**
 *
 * @param dir {string}
 * @returns  {string[]}
 */
function getFiles(dir: string): string[] {
  return fs.readdirSync(dir);
}
