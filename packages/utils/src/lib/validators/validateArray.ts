import {TSRObjValidator} from "../helpers/types";
import {
    ArrayTsRuntimeObject,
    ConcreteTsRuntimeObject, validateTsRuntimeObject,
} from "../../index";
import {Stack} from "../helpers/Stack";
import Valid = Stack.Valid;
import invalidWithReason = Stack.invalidWithReason;
import InvalidType = Stack.InvalidType;
import invalidWithChildren = Stack.invalidWithChildren;

export const validateArray: TSRObjValidator<ArrayTsRuntimeObject & ConcreteTsRuntimeObject> = (tsRuntimeObject, data) => {
    if (Array.isArray(data)) {
        const stackTrace = (data as any[])
            .map(item => validateTsRuntimeObject(tsRuntimeObject.items as ConcreteTsRuntimeObject, item))
            .filter(stackTrace => !stackTrace.valid) as InvalidType[];
        return stackTrace.length === 0 ? Valid : invalidWithChildren(tsRuntimeObject.type, stackTrace);
    } else {
        return invalidWithReason(tsRuntimeObject.type, {
            receivedType: typeof data,
            receivedValue: data
        });
    }
}