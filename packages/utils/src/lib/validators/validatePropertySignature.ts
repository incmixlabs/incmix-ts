import { Stack } from "../helpers/Stack";
import { TSRObjValidator } from "../helpers/types";
import Valid = Stack.Valid;
import {
  ConcreteTsRuntimeObject,
  PropertySignatureTsRuntimeObject,
  validateTsRuntimeObject,
} from "../../index";

export const validatePropertySignature: TSRObjValidator<
  PropertySignatureTsRuntimeObject & ConcreteTsRuntimeObject
> = (tsRuntimeObject, data) => {
  if (tsRuntimeObject.optional && data === undefined) return Valid;
  else
    return validateTsRuntimeObject(
      tsRuntimeObject.tsRuntimeObject as ConcreteTsRuntimeObject,
      data
    );
};
