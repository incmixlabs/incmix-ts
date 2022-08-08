import {
    ArrayTsRuntimeObject,
    BigIntLiteralTsRuntimeObject,
    BigIntTsRuntimeObject,
    BooleanLiteralTsRuntimeObject,
    BooleanTsRuntimeObject,
    ConcreteTsRuntimeObject, EnumTsRuntimeObject, GenericTsRuntimeObjectValue,
    GlobalTsRuntimeObjectKeys,
    InterfaceTsRuntimeObject,
    NumberLiteralTsRuntimeObject,
    NumberTsRuntimeObject, PropertySignatureTsRuntimeObject,
    StringLiteralTsRuntimeObject,
    StringTsRuntimeObject,
    SymbolTsRuntimeObject,
    TsRuntimeObject,
    TupleTsRuntimeObject, UnionTsRuntimeObject,
    UniqueSymbolTsRuntimeObject,
    validateTsRuntimeObject
} from "../src";

const VALIDATE_TSROBJ_TEST_ID = "test_id";

describe(validateTsRuntimeObject, () => {
    const GlobalTSRObj = {
        id: VALIDATE_TSROBJ_TEST_ID,
        generics: undefined,
        documentation: undefined,
    } as ConcreteTsRuntimeObject;

    type ConcreteTSR<T extends GlobalTsRuntimeObjectKeys> = ConcreteTsRuntimeObject & T;

    /*** Primitive tests ***/
    it('Validate data of type number', () => {
        const TSRObj: ConcreteTSR<NumberTsRuntimeObject> = {
            ...GlobalTSRObj,
            type: "number"
        };

        expect(validateTsRuntimeObject(TSRObj, 1)).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
    });

    it('Validate data of type string', () => {
        const TSRObj: ConcreteTSR<StringTsRuntimeObject> = {
            ...GlobalTSRObj,
            type: "string"
        };

        expect(validateTsRuntimeObject(TSRObj, "text")).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, 1)).toBeFalsy();
    });

    it('Validate data of type boolean', () => {
        const TSRObj: ConcreteTSR<BooleanTsRuntimeObject> = {
            ...GlobalTSRObj,
            type: "boolean"
        };

        expect(validateTsRuntimeObject(TSRObj, true)).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, false)).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
    });

    it('Validate data of type bigint', () => {
        const TSRObj: ConcreteTSR<BigIntTsRuntimeObject> = {
            ...GlobalTSRObj,
            type: "bigint"
        };


        expect(validateTsRuntimeObject(TSRObj, BigInt(1))).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
    });

    it('Validate data of type symbol', () => {
        const TSRObj: ConcreteTSR<SymbolTsRuntimeObject> = {
            ...GlobalTSRObj,
            type: "symbol"
        };

        expect(validateTsRuntimeObject(TSRObj, Symbol(1))).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
    });

    it('Validate data of type unique symbol', () => {
        const sym = Symbol("s");
        const TSRObj: ConcreteTSR<UniqueSymbolTsRuntimeObject> = {
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
        const TSRObj: ConcreteTSR<NumberLiteralTsRuntimeObject> = {
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
        const TSRObj: ConcreteTSR<StringLiteralTsRuntimeObject> = {
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
        const TSRObj: ConcreteTSR<BooleanLiteralTsRuntimeObject> = {
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
        const TSRObj: ConcreteTSR<BigIntLiteralTsRuntimeObject> = {
            ...GlobalTSRObj,
            type: "literal",
            literalType: "bigint",
            value: BigInt(5)
        };

        expect(validateTsRuntimeObject(TSRObj, BigInt(5))).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, BigInt(1))).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
    });


    /*** List tests ***/
    it('Validate data of type array', () => {
        const TSRObj: ConcreteTSR<ArrayTsRuntimeObject> = {
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
        const ArrayTSRObj: (type: string) => ConcreteTSR<ArrayTsRuntimeObject> = type => {
            return {
                ...GlobalTSRObj,
                type: "array",
                items: {
                    ...GlobalTSRObj,
                    type
                },
                itemsAreReadOnly: false
            } as ConcreteTSR<ArrayTsRuntimeObject>;
        };

        const itemsSpreadTrue: (type: string) => spreadTrue = type => {
            return {
                spread: true,
                optional: false,
                tsRuntimeObject: ArrayTSRObj(type)
            };
        };

        const TSRObj: ConcreteTSR<TupleTsRuntimeObject> = {
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

        const TupleTSRObj: (types: string[]) => ConcreteTSR<TupleTsRuntimeObject> = types => {
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
            } as ConcreteTSR<TupleTsRuntimeObject>;
        };

        const itemsSpreadTrue: (types: string[]) => spreadTrue = types => {
            return {
                spread: true,
                optional: false,
                tsRuntimeObject: TupleTSRObj(types)
            };
        };

        const TSRObj: ConcreteTSR<TupleTsRuntimeObject> = {
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

        const TSRObj: ConcreteTSR<TupleTsRuntimeObject> = {
            ...GlobalTSRObj,
            type: "tuple",
            items: tupleItems(["string", "number", "boolean"]),
            itemsAreReadOnly: false
        };

        expect(validateTsRuntimeObject(TSRObj, ["name", 2, true] as [string, number, boolean])).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, ["name", 2, true] as any[])).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, ["name", 2])).toBeFalsy();
    });


    /*** Object tests ***/
    it('Validate data of type object', () => {
        const TSRObj: ConcreteTSR<TsRuntimeObject> = {
            ...GlobalTSRObj,
            type: "object",
            properties: {
                "name": {
                    ...GlobalTSRObj,
                    type: "string"
                },
                "details": {
                    ...GlobalTSRObj,
                    type: "object",
                    properties: {
                        "age": {
                            ...GlobalTSRObj,
                            type: "number"
                        }
                    }
                }
            }
        };

        expect(validateTsRuntimeObject(TSRObj, {name: "Lorem ipsum", details: {age: 1}})).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, {name: "Lorem ipsum", details: {}})).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, {name: "Lorem ipsum", details: ""})).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, {name: "Lorem ipsum"})).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, {})).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj, "")).toBeFalsy();
    });

    it('Validate data of type enum', () => {
        enum Enum {A}

        const TSRObj: ConcreteTSR<EnumTsRuntimeObject> = {
            ...GlobalTSRObj,
            type: "enum",
            enum: Enum
        };

        // todo: determine how enums are stored on the front-end for validation
        expect(validateTsRuntimeObject(TSRObj, "A")).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, "B")).toBeFalsy();
    });

    it('Validate data of type interface', () => {
        interface Human {
            name: string;
            age: number;
            isAdult: boolean;
        }

        class Person implements Human {
            age: number;
            isAdult: boolean;
            name: string;

            constructor(age: number, isAdult: boolean, name: string) {
                this.age = age;
                this.isAdult = isAdult;
                this.name = name;
            }
        }

        class Dog {
            age: number;
            name: string;

            constructor(age: number, name: string) {
                this.age = age;
                this.name = name;
            }
        }

        const john = {
            name: "john",
            age: 45,
            isAdult: true
        }
        const TSRObj: ConcreteTSR<InterfaceTsRuntimeObject> = {
            ...GlobalTSRObj,
            type: "interface",
            members: {
                "name": {
                    ...GlobalTSRObj,
                    type: "string"
                },
                "age": {
                    ...GlobalTSRObj,
                    type: "number"
                },
                "isAdult": {
                    ...GlobalTSRObj,
                    type: "boolean"
                },
            }
        };

        expect(validateTsRuntimeObject(TSRObj, Person)).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, john)).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj, Dog)).toBeFalsy();
    });

    it('Validate date of type union', () => {
        const TSRObj: (types: ("string" | "number" | "boolean")[]) => ConcreteTSR<UnionTsRuntimeObject> = types => {
            return {
                ...GlobalTSRObj,
                type: "union",
                members: types.map(type => {
                    return {
                        ...GlobalTSRObj,
                        type
                    } as TsRuntimeObject;
                })
            };
        };

        expect(validateTsRuntimeObject(TSRObj(["string", "number"]), 2)).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj(["string", "number"]), "text")).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj(["boolean", "number"]), "text")).toBeFalsy();
    });

    it('Validate date of type property signature', () => {
        const TSRObj:
            (type: "string" | "number" | "boolean" | "object", optional: boolean) => ConcreteTSR<PropertySignatureTsRuntimeObject> =
            (type, optional) => {
                return {
                    ...GlobalTSRObj,
                    type: "propertySignature",
                    optional,
                    tsRuntimeObject: {
                        ...GlobalTSRObj,
                        type
                    } as TsRuntimeObject
                };
            };

        expect(validateTsRuntimeObject(TSRObj("string", false), "test")).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj("string", true), undefined)).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj("boolean", false), false)).toBeTruthy();
        expect(validateTsRuntimeObject(TSRObj("string", false), undefined)).toBeFalsy();
        expect(validateTsRuntimeObject(TSRObj("string", false), 1)).toBeFalsy();
    });
});