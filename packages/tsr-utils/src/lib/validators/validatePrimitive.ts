import {PrimitiveTSRObj, TSRObjValidator} from "../helpers/types";
import {Stack} from "../helpers/Stack";
import Valid = Stack.Valid;
import invalidWithReason = Stack.invalidWithReason;


export const validatePrimitive: TSRObjValidator<PrimitiveTSRObj> = (tsRuntimeObject, data) => {
    if (typeof data === tsRuntimeObject.type) {
        return Valid;
    } else {
        return invalidWithReason(tsRuntimeObject.type, {
            receivedType: typeof data,
            receivedValue: data
        });
    }
}