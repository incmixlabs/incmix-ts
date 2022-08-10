import {TSRObjValidator} from "../helpers/types";
import {ConcreteTsRuntimeObject, ObjectTsRuntimeObject, validateTsRuntimeObject} from "../../index";
import {Stack} from "../helpers/Stack";
import Valid = Stack.Valid;
import invalidWithReason = Stack.invalidWithReason;
import InvalidType = Stack.InvalidType;
import invalidWithChildren = Stack.invalidWithChildren;

export const validateObject: TSRObjValidator<ObjectTsRuntimeObject & ConcreteTsRuntimeObject> = (tsRuntimeObject, data) => {
    data = data as object;
    const stackTracesOfChildren = Object.keys(tsRuntimeObject.properties).map(key => {
        // Check if key exists on data
        if (Object.keys(data).includes(key)) {
            // Validate the value associated with that key with respect to the TSRObj schema
            const stackTrace = validateTsRuntimeObject(tsRuntimeObject.properties[key] as ConcreteTsRuntimeObject, data[key]);
            if (!stackTrace.valid) {
                // Invalid properties need to have their key attached to the Invalid node
                stackTrace.name = key;
                return stackTrace;
            }
            else return undefined;
        } else {
            // Data doesn't have a property with this key - so,
            // return an invalid node; where expected type is the property's value
            return invalidWithReason(tsRuntimeObject.properties[key].type, {
                receivedType: "undefined",
                receivedValue: "undefined",
                expectedValue: tsRuntimeObject.properties[key]
            },{name: key});
        }
    }).filter(stackTrace => !!stackTrace) as InvalidType[];

    return stackTracesOfChildren.length === 0 ? Valid : invalidWithChildren(tsRuntimeObject.type, stackTracesOfChildren);
}