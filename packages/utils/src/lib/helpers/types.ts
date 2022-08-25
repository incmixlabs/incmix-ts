import {
  BigIntLiteralTsRuntimeObject,
  BigIntTsRuntimeObject,
  BooleanLiteralTsRuntimeObject,
  BooleanTsRuntimeObject,
  ConcreteTsRuntimeObject,
  NumberLiteralTsRuntimeObject,
  NumberTsRuntimeObject,
  SpecialTsRuntimeObject,
  StringLiteralTsRuntimeObject,
  StringTsRuntimeObject,
  SymbolTsRuntimeObject,
} from "../../index";
import { ValidityTree } from "./ValidityTree";

export type LiteralTSRObj = (
  | NumberLiteralTsRuntimeObject
  | StringLiteralTsRuntimeObject
  | BooleanLiteralTsRuntimeObject
  | BigIntLiteralTsRuntimeObject
) &
  ConcreteTsRuntimeObject;

export type PrimitiveTSRObj = (
  | NumberTsRuntimeObject
  | StringTsRuntimeObject
  | BooleanTsRuntimeObject
  | BigIntTsRuntimeObject
  | SymbolTsRuntimeObject
) &
  ConcreteTsRuntimeObject;

export type TSRObjValidator<
  T extends ConcreteTsRuntimeObject = ConcreteTsRuntimeObject
> = (
  tsRuntimeObject: T,
  data: any,
  params?: {
    customValidator?: TSRObjValidator<
      SpecialTsRuntimeObject & ConcreteTsRuntimeObject
    >;
  }
) => ValidityTree;
