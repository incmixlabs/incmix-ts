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

    /*** Primitive tests ***/
    it('Validate data of type number', () => {
        const TSRObj: ConcreteTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "number"
        };

        expect(validateTsRuntimeObject(TSRObj, 1)).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
    });

    it('Validate data of type string', () => {
        const TSRObj: ConcreteTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "string"
        };

        expect(validateTsRuntimeObject(TSRObj, "text")).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, 1)).toBeFalsy();
    });

    it('Validate data of type boolean', () => {
        const TSRObj: ConcreteTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "boolean"
        };

        expect(validateTsRuntimeObject(TSRObj, true)).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, false)).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
    });

    it('Validate data of type bigint', () => {
        const TSRObj: ConcreteTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "bigint"
        };


        expect(validateTsRuntimeObject(TSRObj, BigInt(1))).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
    });

    it('Validate data of type symbol', () => {
        const TSRObj: ConcreteTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "symbol"
        };

        expect(validateTsRuntimeObject(TSRObj, Symbol(1))).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
    });


    /*** Primitive literal tests ***/
    it('Validate data of type number literal', () => {
        const TSRObj: ConcreteTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "literal",
            literalType: "number",
            value: 5
        };

        expect(validateTsRuntimeObject(TSRObj, 5)).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, 1)).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
    });

    it('Validate data of type string literal', () => {
        const TSRObj: ConcreteTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "literal",
            literalType: "string",
            value: "text"
        };

        expect(validateTsRuntimeObject(TSRObj, "text")).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, "other text")).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, 1)).toBeFalsy();
    });

    it('Validate data of type boolean literal', () => {
        const TSRObj: ConcreteTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "literal",
            literalType: "boolean",
            value: true
        };

        expect(validateTsRuntimeObject(TSRObj, true)).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, false)).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
    });

    it('Validate data of type bigint literal', () => {
        const TSRObj: ConcreteTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "literal",
            literalType: "bigint",
            value: BigInt(5)
        };

        expect(validateTsRuntimeObject(TSRObj, BigInt(5))).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, BigInt(1))).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
    });


    /*** Object tests ***/
});