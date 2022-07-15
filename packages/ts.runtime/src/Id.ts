import { randomUUID } from "crypto";

export interface Id {
  generateId: () => string;
}

export const id: Id = {
  generateId: function (): string {
    return randomUUID();
  },
};
