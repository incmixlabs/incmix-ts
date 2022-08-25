import {
  InvalidLeaf,
  PrimitiveTSRObj,
  Reason,
  TSRObjValidator,
  Valid,
} from "../helpers";

export const validatePrimitive: TSRObjValidator<PrimitiveTSRObj> = (
  tsRuntimeObject,
  data
) => {
  if (typeof data === tsRuntimeObject.type) {
    return new Valid();
  } else {
    return new InvalidLeaf(tsRuntimeObject.type, new Reason(typeof data, data));
  }
};
