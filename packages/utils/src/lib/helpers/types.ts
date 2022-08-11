import {
    BigIntLiteralTsRuntimeObject, BigIntTsRuntimeObject,
    BooleanLiteralTsRuntimeObject, BooleanTsRuntimeObject,
    ConcreteTsRuntimeObject,
    NumberLiteralTsRuntimeObject, NumberTsRuntimeObject, SpecialTsRuntimeObject,
    StringLiteralTsRuntimeObject, StringTsRuntimeObject, SymbolTsRuntimeObject
} from "../../index";
import {Stack} from "./Stack";
import StackTrace = Stack.StackTrace;

export type LiteralTSRObj = (
    NumberLiteralTsRuntimeObject
    | StringLiteralTsRuntimeObject
    | BooleanLiteralTsRuntimeObject
    | BigIntLiteralTsRuntimeObject
    ) & ConcreteTsRuntimeObject;

export type PrimitiveTSRObj = (
    NumberTsRuntimeObject
    | StringTsRuntimeObject
    | BooleanTsRuntimeObject
    | BigIntTsRuntimeObject
    | SymbolTsRuntimeObject
    ) & ConcreteTsRuntimeObject;

export type TSRObjValidator<T extends ConcreteTsRuntimeObject = ConcreteTsRuntimeObject> = (
    tsRuntimeObject: T,
    data: any,
    params?: {
        customValidator?: TSRObjValidator<SpecialTsRuntimeObject & ConcreteTsRuntimeObject>
    }
) => StackTrace;