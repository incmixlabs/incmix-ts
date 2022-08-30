import {
  ConcreteTsRuntimeObject,
  UnionTsRuntimeObject,
  validateTsRuntimeObject,
} from "../../index";
import { Invalid, InvalidNode, TSRObjValidator, Valid } from "../helpers";

export const validateUnion: TSRObjValidator<
  UnionTsRuntimeObject & ConcreteTsRuntimeObject
> = (tsRuntimeObject, data) => {
  // Compare data against each type - if it matches at least one then it is valid
  const validityTrees = tsRuntimeObject.members.map((member) =>
    validateTsRuntimeObject(member as ConcreteTsRuntimeObject, data)
  );

  if (validityTrees.find((node) => node instanceof Valid) !== undefined)
    return new Valid();
  else return new InvalidNode(tsRuntimeObject.type, validityTrees as Invalid[]);
};
