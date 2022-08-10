import {TSRObjValidator} from "../helpers/types";
import {
    ConcreteTsRuntimeObject,
    InterfaceTsRuntimeObject,
    ObjectTsRuntimeObject, TsRuntimeObject,
    validateTsRuntimeObject
} from "../../index";
import {Stack} from "../helpers/Stack";
import Valid = Stack.Valid;
import invalidWithReason = Stack.invalidWithReason;
import InvalidType = Stack.InvalidType;
import invalidWithChildren = Stack.invalidWithChildren;

export const validateObjectOrInterface: TSRObjValidator<(ObjectTsRuntimeObject | InterfaceTsRuntimeObject) & ConcreteTsRuntimeObject> = (tsRuntimeObject, data) => {
    data = data as object;
    const childrenObj = tsRuntimeObject.type === "object" ?
        (tsRuntimeObject as ObjectTsRuntimeObject & ConcreteTsRuntimeObject).properties:
        (tsRuntimeObject as InterfaceTsRuntimeObject & ConcreteTsRuntimeObject).members;

    const stackTracesOfChildren = Object.keys(childrenObj).map(key => {
        // Check if key exists on data
        if (Object.keys(data).includes(key)) {
            // Validate the value associated with that key with respect to the TSRObj schema
            const stackTrace = validateTsRuntimeObject(childrenObj[key] as ConcreteTsRuntimeObject, data[key]);
            if (!stackTrace.valid) {
                // Invalid properties need to have their key attached to the Invalid node
                stackTrace.name = key;
                return stackTrace;
            }
            else return undefined;
        } else {
            // Data doesn't have a property with this key - so,
            // return an invalid node; where expected type is the property's value
            return invalidWithReason(childrenObj[key].type, {
                receivedType: "undefined",
                receivedValue: "undefined",
                expectedValue: childrenObj[key]
            },{name: key});
        }
    }).filter(stackTrace => !!stackTrace) as InvalidType[];

    return stackTracesOfChildren.length === 0 ? Valid : invalidWithChildren(tsRuntimeObject.type, stackTracesOfChildren);
}