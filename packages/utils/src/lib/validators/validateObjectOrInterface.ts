import {
  ConcreteTsRuntimeObject,
  InterfaceTsRuntimeObject,
  ObjectTsRuntimeObject,
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

export const validateObjectOrInterface: TSRObjValidator<
  (ObjectTsRuntimeObject | InterfaceTsRuntimeObject) & ConcreteTsRuntimeObject
> = (tsRuntimeObject, data) => {
  // Ensure that the data is neither null nor undefined
  if (data === undefined || data === null) {
    return new InvalidLeaf(tsRuntimeObject.type, new Reason(typeof data, data));
  }

  data = data as object;
  const childrenObj =
    tsRuntimeObject.type === "object"
      ? (tsRuntimeObject as ObjectTsRuntimeObject & ConcreteTsRuntimeObject)
          .properties
      : (tsRuntimeObject as InterfaceTsRuntimeObject & ConcreteTsRuntimeObject)
          .members;

  const stackTracesOfChildren = Object.keys(childrenObj)
    .map((key) => {
      // Check if key exists on data
      if (Object.keys(data).includes(key)) {
        // Validate the value associated with that key with respect to the TSRObj schema
        const validityTree = validateTsRuntimeObject(
          childrenObj[key] as ConcreteTsRuntimeObject,
          data[key]
        );
        if (validityTree instanceof Invalid) {
          // Invalid properties need to have their key attached to the Invalid node
          validityTree.name = key;
          return validityTree;
        } else return undefined;
      } else {
        // Data doesn't have a property with this key - so,
        // return an invalid node; where expected type is the property's value
        return new InvalidLeaf(
          childrenObj[key].type,
          new Reason("undefined", "undefined", childrenObj[key]),
          { name: key }
        );
      }
    })
    .filter((validityTree) => !!validityTree) as Invalid[];

  return stackTracesOfChildren.length === 0
    ? new Valid()
    : new InvalidNode(tsRuntimeObject.type, stackTracesOfChildren);
};
