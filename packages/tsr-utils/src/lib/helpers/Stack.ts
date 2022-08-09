import {TsRuntimeObject} from "../../index";

export namespace Stack {
    export type ValidType = { valid: true };

    export type InvalidTypeReason = {
        receivedType: string,
        receivedValue: any,
        expectedValue?: any
    };
    export type InvalidType = ({
        children: InvalidType[]
    } | {
        reason: InvalidTypeReason
    }) & {
        valid: false,
        type: TsRuntimeObject["type"]
    };

    export type StackTrace = ValidType | InvalidType;

    export const Valid: ValidType = { valid: true };
    export const invalidWithChildren: (type: TsRuntimeObject["type"], children: InvalidType[]) => InvalidType = (type, children) => {
        return {
            valid: false,
            type,
            children
        };
    };

    export const invalidWithReason: (type: TsRuntimeObject["type"], reason: InvalidTypeReason) => InvalidType = (type, reason) => {
        return {
            valid: false,
            type,
            reason
        };
    };
}