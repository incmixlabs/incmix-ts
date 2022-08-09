import {
    BigIntLiteralTsRuntimeObject, BigIntTsRuntimeObject,
    BooleanLiteralTsRuntimeObject, BooleanTsRuntimeObject,
    ConcreteTsRuntimeObject,
    NumberLiteralTsRuntimeObject, NumberTsRuntimeObject,
    StringLiteralTsRuntimeObject, StringTsRuntimeObject, SymbolTsRuntimeObject, TsRuntimeObject
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
    data: any
) => StackTrace;