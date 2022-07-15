import { readFileSync, writeFileSync } from "fs";
import ts from "typescript";
import { Failable } from "../Failable";

export interface FileIO {
  read: Failable.Fn<string, string>;
  write: Failable.Fn<{ filePath: string; text: string }, void>;
}

export const fileIO: FileIO = {
  read: Failable.fnFromExceptionThrowing<string, string>((filepath) => {
    return readFileSync(filepath).toString();
  }),

  write: Failable.fnFromExceptionThrowing<
    { filePath: string; text: string },
    void
  >((params) => {
    return writeFileSync(params.filePath, params.text);
  }),
};
