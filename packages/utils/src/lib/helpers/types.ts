import {
  BigIntLiteralTsRuntimeObject,
  BigIntTsRuntimeObject,
  BooleanLiteralTsRuntimeObject,
  BooleanTsRuntimeObject,
  ConcreteTsRuntimeObject,
  CustomTsRuntimeObject,
  NumberLiteralTsRuntimeObject,
  NumberTsRuntimeObject,
  StringLiteralTsRuntimeObject,
  StringTsRuntimeObject,
  SymbolTsRuntimeObject,
} from "../../index";
import { ValidityTree } from "./ValidityTree";

/**
 * The super type of any literal TSR object
 */
export type LiteralTSRObj = (
  | NumberLiteralTsRuntimeObject
  | StringLiteralTsRuntimeObject
  | BooleanLiteralTsRuntimeObject
  | BigIntLiteralTsRuntimeObject
) &
  ConcreteTsRuntimeObject;

/**
 * The super type of any primitive TSR object
 */
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
      CustomTsRuntimeObject & ConcreteTsRuntimeObject
    >;
  }
) => ValidityTree;
