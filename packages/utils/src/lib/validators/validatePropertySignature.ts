import {
  ConcreteTsRuntimeObject,
  PropertySignatureTsRuntimeObject,
  validateTsRuntimeObject,
} from "../../index";
import { TSRObjValidator, Valid } from "../helpers";

export const validatePropertySignature: TSRObjValidator<
  PropertySignatureTsRuntimeObject & ConcreteTsRuntimeObject
> = (tsRuntimeObject, data) => {
  if (tsRuntimeObject.optional && data === undefined) return new Valid();
  else
    return validateTsRuntimeObject(
      tsRuntimeObject.tsRuntimeObject as ConcreteTsRuntimeObject,
      data
    );
};
