import {
    ArrayTsRuntimeObject,
    ConcreteTsRuntimeObject, GlobalTsRuntimeObjectKeys, NumberTsRuntimeObject, TsRuntimeObject, TupleTsRuntimeObject,
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

    it('Validate data of type unique symbol', () => {
        const sym = Symbol("s");
        const TSRObj: ConcreteTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "unique symbol",
            uniqueSymbolTypeId: sym
        };

        expect(validateTsRuntimeObject(TSRObj, sym)).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, Symbol("s"))).toBeFalsy();
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
    it('Validate data of type array', () => {
        const TSRObj: ConcreteTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "array",
            items: {
                ...GlobalTSRObj,
                type: "string"
            },
            itemsAreReadOnly: false
        };

        expect(validateTsRuntimeObject(TSRObj, ["text", "text"])).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, [])).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, ["text", 5])).toBeFalsy();
    });

    it('Validate data of type tuple - spread true: array', () => {
        type spreadTrue = {
            readonly spread: true;
            readonly optional: false;
            readonly tsRuntimeObject: ArrayTsRuntimeObject | TupleTsRuntimeObject;
        };
        const ArrayTSRObj: (type: string) => ConcreteTsRuntimeObject & ArrayTsRuntimeObject = type => {
            return {
                ...GlobalTSRObj,
                type: "array",
                items: {
                    ...GlobalTSRObj,
                    type
                },
                itemsAreReadOnly: false
            } as ConcreteTsRuntimeObject & ArrayTsRuntimeObject;
        };

        const itemsSpreadTrue: (type: string) => spreadTrue = type => {
            return {
                spread: true,
                optional: false,
                tsRuntimeObject: ArrayTSRObj(type)
            };
        };

        const TSRObj: ConcreteTsRuntimeObject & TupleTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "tuple",
            items: [itemsSpreadTrue("string"), itemsSpreadTrue("number"), itemsSpreadTrue("boolean")],
            itemsAreReadOnly: false
        };

        expect(validateTsRuntimeObject(TSRObj, [["name", "age", "yes"], [2, 12, 3], [true, false]] as [string[], number[], boolean[]])).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, [["name", "age", "yes"], [2, 12, 3], [true, false]] as [string[], number[], [boolean, boolean]])).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, [["name"], 2, [true]] as [any, any, any])).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, [["name"]])).toBeFalsy();
    });

    it('Validate data of type tuple - spread true: tuple', () => {
        type spreadTrue = {
            readonly spread: true;
            readonly optional: false;
            readonly tsRuntimeObject: ArrayTsRuntimeObject | TupleTsRuntimeObject;
        };

        const TupleTSRObj: (types: string[]) => ConcreteTsRuntimeObject & TupleTsRuntimeObject = types => {
            return {
                ...GlobalTSRObj,
                type: "tuple",
                items: types.map(type => {
                    return {
                        ...GlobalTSRObj,
                        spread: false,
                        optional: false,
                        tsRuntimeObject: {
                            ...GlobalTSRObj,
                            type
                        }
                    };
                }),
                itemsAreReadOnly: false
            } as ConcreteTsRuntimeObject & TupleTsRuntimeObject;
        };

        const itemsSpreadTrue: (types: string[]) => spreadTrue = types => {
            return {
                spread: true,
                optional: false,
                tsRuntimeObject: TupleTSRObj(types)
            };
        };

        const TSRObj: ConcreteTsRuntimeObject & TupleTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "tuple",
            items: [itemsSpreadTrue(["string", "boolean"]), itemsSpreadTrue(["number"])],
            itemsAreReadOnly: false
        };

        expect(validateTsRuntimeObject(TSRObj, [["name", true], [2]] as [[string, boolean], [number]])).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, [["name", true], [2]] as [[string, any], [number]])).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, [[true], [2]] as [[boolean], [number]])).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, [["name", true], [""]])).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
    });

    it('Validate data of type tuple - spread false', () => {
        type spreadFalse = {
            readonly spread: false;
            readonly optional: boolean;
            readonly tsRuntimeObject: TsRuntimeObject;
        };

        const tupleItems: (types: string[]) => spreadFalse[] = types =>
            types.map(type => {
                return {
                    spread: false,
                    optional: false,
                    tsRuntimeObject: {
                        ...GlobalTSRObj,
                        type
                    }
                } as spreadFalse;
            }) as spreadFalse[];

        const TSRObj: ConcreteTsRuntimeObject & TupleTsRuntimeObject = {
            ...GlobalTSRObj,
            type: "tuple",
            items: tupleItems(["string", "number", "boolean"]),
            itemsAreReadOnly: false
        };

        expect(validateTsRuntimeObject(TSRObj, ["name", 2, true] as [string, number, boolean])).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, ["name", 2, true] as any[])).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, ["name", 2])).toBeFalsy();
    });
});