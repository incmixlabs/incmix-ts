import {
  ArrayTsRuntimeObject,
  ConcreteTsRuntimeObject,
  validateTsRuntimeObject,
} from "../../index";
import {
  Invalid,
  InvalidLeaf,
  InvalidNode,
  Reason,
  TSRObjValidator,
  Valid,
} from "../helpers";

export const validateArray: TSRObjValidator<
  ArrayTsRuntimeObject & ConcreteTsRuntimeObject
> = (tsRuntimeObject, data) => {
  if (Array.isArray(data)) {
    const validityTree = (data as any[])
      .map((item) =>
        validateTsRuntimeObject(
          tsRuntimeObject.items as ConcreteTsRuntimeObject,
          item
        )
      )
      .filter((validityTree) => validityTree instanceof Invalid) as Invalid[];
    return validityTree.length === 0
      ? new Valid()
      : new InvalidNode(tsRuntimeObject.type, validityTree);
  } else {
    return new InvalidLeaf(tsRuntimeObject.type, new Reason(typeof data, data));
  }
};
