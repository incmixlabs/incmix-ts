import { readFileSync, writeFileSync } from "fs";
import ts from "typescript";
import { Failable } from "../Failable";

export interface FileOutput {
  write: Failable.Fn<{ filePath: string; text: string }, void>;
}

export const fileOutput: FileOutput = {
  write: Failable.fnFromExceptionThrowing<
    { filePath: string; text: string },
    void
  >((params) => {
    return writeFileSync(params.filePath, params.text);
  }),
};
