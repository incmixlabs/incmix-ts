import { Stack } from "../helpers/Stack";
import { TSRObjValidator } from "../helpers/types";
import Valid = Stack.Valid;
import {
  ConcreteTsRuntimeObject,
  UnionTsRuntimeObject,
  validateTsRuntimeObject,
} from "../../index";
import invalidWithChildren = Stack.invalidWithChildren;
import InvalidType = Stack.InvalidType;

export const validateUnion: TSRObjValidator<
  UnionTsRuntimeObject & ConcreteTsRuntimeObject
> = (tsRuntimeObject, data) => {
  // Compare data against each type - if it matches at least one then it is valid
  const stackTraces = tsRuntimeObject.members.map((member) =>
    validateTsRuntimeObject(member as ConcreteTsRuntimeObject, data)
  );

  if (stackTraces.includes(Valid)) return Valid;
  else
    return invalidWithChildren(
      tsRuntimeObject.type,
      stackTraces as InvalidType[]
    );
};
