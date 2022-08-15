import { Stack } from "../helpers/Stack";
import { TSRObjValidator } from "../helpers/types";
import Valid = Stack.Valid;
import { ConcreteTsRuntimeObject, EnumTsRuntimeObject } from "../../index";
import invalidWithReason = Stack.invalidWithReason;

export const validateEnum: TSRObjValidator<
  EnumTsRuntimeObject & ConcreteTsRuntimeObject
> = (tsRuntimeObject, data) => {
  if (Object.keys(tsRuntimeObject.enum).includes(data)) {
    return Valid;
  } else {
    return invalidWithReason(tsRuntimeObject.type, {
      receivedType: typeof data,
      receivedValue: data,
    });
  }
};
