import {
  ConcreteTsRuntimeObject,
  TupleTsRuntimeObject,
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

export const validateTuple: TSRObjValidator<
  TupleTsRuntimeObject & ConcreteTsRuntimeObject
> = (tsRuntimeObject, data) => {
  if (Array.isArray(data)) {
    const dataAsArray = data as any[];

    const validityTree = Array(
      Math.max(tsRuntimeObject.items.length, dataAsArray.length)
    )
      .fill(undefined)
      /*
       * Validate each element of data against each element in the TSR object tuple.
       * If either tuple is longer than the other - then:
       * - either undefined is validated against the correct element in the TSR object
       *   tuple or,
       * - the data element is validated against undefined
       */
      .map((_, i) =>
        validateTsRuntimeObject(
          (i < tsRuntimeObject.items.length
            ? tsRuntimeObject.items[i].tsRuntimeObject
            : undefined) as ConcreteTsRuntimeObject,
          dataAsArray[i]
        )
      )
      /*
       * Attach the index number of any invalid tuple data and remove any valid stack traces
       */
      .map((validityTree, i) => {
        if (validityTree instanceof Invalid) {
          validityTree.index = i;
          return validityTree;
        } else return undefined;
      })
      .filter((validityTree) => !!validityTree) as Invalid[];
    /*
     * Return a valid stack trace if the data matches the tuple's schema.
     * Otherwise, wrap all invalid data in a stack trace to represent this
     * tuple's invalid data
     * */
    return validityTree.length === 0
      ? new Valid()
      : new InvalidNode(tsRuntimeObject.type, validityTree);
  } else {
    // Data isn't a tuple so it is invalid
    return new InvalidLeaf(tsRuntimeObject.type, new Reason(typeof data, data));
  }
};
