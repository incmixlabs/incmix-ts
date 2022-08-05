export interface Logger {
  log(text: string): void;
  error(text: string): void;
}

export const logger: Logger = {
  log: console.log,
  error: console.error,
};
