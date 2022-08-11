import { Stack } from "../helpers/Stack";
import { LiteralTSRObj, TSRObjValidator } from "../helpers/types";
import Valid = Stack.Valid;
import invalidWithReason = Stack.invalidWithReason;

export const validateLiteral: TSRObjValidator<LiteralTSRObj> = (
  tsRuntimeObject,
  data
) => {
  const primitiveLiterals: readonly string[] = [
    "number",
    "string",
    "boolean",
    "bigint",
  ];

  if (
    primitiveLiterals.includes(tsRuntimeObject.literalType) &&
    tsRuntimeObject.value === data
  ) {
    return Valid;
  } else {
    return invalidWithReason(tsRuntimeObject.type, {
      receivedType: typeof data,
      receivedValue: data,
      expectedValue: tsRuntimeObject.value,
    });
  }
};
