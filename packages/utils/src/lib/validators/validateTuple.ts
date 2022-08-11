import {
  ConcreteTsRuntimeObject,
  TupleTsRuntimeObject,
  validateTsRuntimeObject,
} from "../../index";
import { Stack } from "../helpers/Stack";
import { TSRObjValidator } from "../helpers/types";
import Valid = Stack.Valid;
import invalidWithReason = Stack.invalidWithReason;
import InvalidType = Stack.InvalidType;
import invalidWithChildren = Stack.invalidWithChildren;

export const validateTuple: TSRObjValidator<
  TupleTsRuntimeObject & ConcreteTsRuntimeObject
> = (tsRuntimeObject, data) => {
  if (Array.isArray(data)) {
    const dataAsArray = data as any[];

    const stackTrace = Array(
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
      .map((stackTrace, i) => {
        if (!stackTrace.valid) {
          stackTrace["index"] = i;
          return stackTrace;
        } else return undefined;
      })
      .filter((stackTrace) => !!stackTrace) as InvalidType[];
    /*
     * Return a valid stack trace if the data matches the tuple's schema.
     * Otherwise, wrap all invalid data in a stack trace to represent this
     * tuple's invalid data
     * */
    return stackTrace.length === 0
      ? Valid
      : invalidWithChildren(tsRuntimeObject.type, stackTrace);
  } else {
    // Data isn't a tuple so it is invalid
    return invalidWithReason(tsRuntimeObject.type, {
      receivedType: typeof data,
      receivedValue: data,
    });
  }
};
