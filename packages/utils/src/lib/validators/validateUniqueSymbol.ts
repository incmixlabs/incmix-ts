import { Stack } from "../helpers/Stack";
import { TSRObjValidator } from "../helpers/types";
import Valid = Stack.Valid;
import invalidWithReason = Stack.invalidWithReason;
import {
  ConcreteTsRuntimeObject,
  UniqueSymbolTsRuntimeObject,
} from "../../index";

export const validateUniqueSymbol: TSRObjValidator<
  UniqueSymbolTsRuntimeObject & ConcreteTsRuntimeObject
> = (tsRuntimeObject, data) => {
  if (data === tsRuntimeObject.uniqueSymbolTypeId) {
    return Valid;
  } else {
    return invalidWithReason(tsRuntimeObject.type, {
      receivedType: typeof data,
      receivedValue: data,
      expectedValue: tsRuntimeObject.uniqueSymbolTypeId,
    });
  }
};
