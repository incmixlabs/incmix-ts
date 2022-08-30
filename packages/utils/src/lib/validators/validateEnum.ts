import { ConcreteTsRuntimeObject, EnumTsRuntimeObject } from "../../index";
import { InvalidLeaf, Reason, TSRObjValidator, Valid } from "../helpers";

export const validateEnum: TSRObjValidator<
  EnumTsRuntimeObject & ConcreteTsRuntimeObject
> = (tsRuntimeObject, data) => {
  if (Object.keys(tsRuntimeObject.enum).includes(data)) {
    return new Valid();
  } else {
    return new InvalidLeaf(tsRuntimeObject.type, new Reason(typeof data, data));
  }
};
