import {
    ConcreteTsRuntimeObject, GlobalTsRuntimeObjectKeys, NumberTsRuntimeObject,
    validateTsRuntimeObject
} from "../src";

const VALIDATE_TSROBJ_TEST_ID = "test_id";

describe(validateTsRuntimeObject, () => {
    const GlobalTSRObj = {
        id: VALIDATE_TSROBJ_TEST_ID,
        generics: undefined,
        documentation: undefined,
    } as ConcreteTsRuntimeObject;

    it('should validate data of type number', () => {
        const numberTSRObj: ConcreteTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "number"
        };
        expect(validateTsRuntimeObject(numberTSRObj, 1));
    });
});