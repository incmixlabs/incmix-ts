import {TSRObjValidator} from "../helpers/types";
import {ConcreteTsRuntimeObject, ObjectTsRuntimeObject, validateTsRuntimeObject} from "../../index";
import {Stack} from "../helpers/Stack";
import Valid = Stack.Valid;
import invalidWithReason = Stack.invalidWithReason;
import InvalidType = Stack.InvalidType;
import invalidWithChildren = Stack.invalidWithChildren;

export const validateObject: TSRObjValidator<ObjectTsRuntimeObject & ConcreteTsRuntimeObject> = (tsRuntimeObject, data) => {
    data = data as object;
    const stackTracesOfChildren = Object.keys(tsRuntimeObject.properties).map(property => {
        // Check if key exists on data
        if (Object.keys(data).includes(property)) {
            // Validate the value associated with that key with respect to the TSRObj schema
            return validateTsRuntimeObject(tsRuntimeObject.properties[property] as ConcreteTsRuntimeObject, data[property]);
        } else {
            // Return invalid error where expected type is the property's value
            return invalidWithReason(tsRuntimeObject.properties[property].type, {
                receivedType: "undefined",
                receivedValue: "undefined",
                expectedValue: tsRuntimeObject.properties[property],
                name: property
            });
        }
    }).filter(trace => !trace.valid).map(_ => _ as InvalidType);

    return stackTracesOfChildren.length === 0 ? Valid : invalidWithChildren(tsRuntimeObject.type, stackTracesOfChildren);
}