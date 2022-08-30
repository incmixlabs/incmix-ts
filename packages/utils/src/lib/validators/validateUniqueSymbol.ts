import {
  ConcreteTsRuntimeObject,
  UniqueSymbolTsRuntimeObject,
} from "../../index";
import { InvalidLeaf, Reason, TSRObjValidator, Valid } from "../helpers";

export const validateUniqueSymbol: TSRObjValidator<
  UniqueSymbolTsRuntimeObject & ConcreteTsRuntimeObject
> = (tsRuntimeObject, data) => {
  if (data === tsRuntimeObject.uniqueSymbolTypeId) {
    return new Valid();
  } else {
    return new InvalidLeaf(
      tsRuntimeObject.type,
      new Reason(typeof data, data, tsRuntimeObject.uniqueSymbolTypeId)
    );
  }
};
