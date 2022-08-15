import { TsRuntimeObject } from "../../index";

export namespace Stack {
  export type ValidType = { valid: true };

  export type InvalidTypeReason = {
    receivedType: string;
    receivedValue: any;
    expectedValue?: any;
  };
  export type InvalidType = (
    | {
        children: InvalidType[];
      }
    | {
        reason: InvalidTypeReason;
      }
  ) & {
    valid: false;
    expectedType: TsRuntimeObject["type"];
    name?: string;
    index?: number;
  };

  export type StackTrace = ValidType | InvalidType;

  export const Valid: ValidType = { valid: true };
  export const invalidWithChildren: (
    type: TsRuntimeObject["type"],
    children: InvalidType[],
    params?: {
      name?: string;
      index?: number;
    }
  ) => InvalidType = (type, children) => {
    return {
      valid: false,
      expectedType: type,
      children,
    };
  };

  export const invalidWithReason: (
    type: TsRuntimeObject["type"],
    reason: InvalidTypeReason,
    params?: {
      name?: string;
      index?: number;
    }
  ) => InvalidType = (type, reason) => {
    return {
      valid: false,
      expectedType: type,
      reason,
    };
  };
}
