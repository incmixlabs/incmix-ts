import { CommanderError } from "commander";

export interface CommanderProgram {
  exitOverride(err: CommanderError): void;
}

export const commanderProgram: CommanderProgram = {
  exitOverride: () => {
    /* noop */
  },
};
