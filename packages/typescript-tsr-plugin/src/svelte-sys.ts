import ts from "typescript";
import { Logger } from "./logger";
import {
  ensureRealTsrFilePath,
  isVirtualTsrFilePath,
  toRealTsrFilePath,
} from "./utils";

/**
 * This should only be accessed by TS Tsr module resolution.
 */
export function createTsrSys(logger: Logger) {
  const TsrSys: ts.System = {
    ...ts.sys,
    fileExists(path: string) {
      return ts.sys.fileExists(ensureRealTsrFilePath(path));
    },
    readDirectory(path, extensions, exclude, include, depth) {
      const extensionsWithTsr = (extensions ?? []).concat(".Tsr");

      return ts.sys.readDirectory(
        path,
        extensionsWithTsr,
        exclude,
        include,
        depth
      );
    },
  };

  if (ts.sys.realpath) {
    const realpath = ts.sys.realpath;
    TsrSys.realpath = function (path) {
      if (isVirtualTsrFilePath(path)) {
        return realpath(toRealTsrFilePath(path)) + ".ts";
      }
      return realpath(path);
    };
  }

  return TsrSys;
}
