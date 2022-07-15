export interface Args {
  getArgs(): string[];
  startsOnActualArguments(): boolean;
}

export const args: Args = {
  getArgs() {
    return process.argv;
  },
  startsOnActualArguments() {
    return false;
  },
};
