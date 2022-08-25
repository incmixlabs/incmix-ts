import { TsRuntimeObject } from "../../../index";
import { ValidityTree } from "./ValidityTree";

export abstract class Invalid implements ValidityTree {
  readonly valid: false = false;
  protected readonly expectedType!: TsRuntimeObject["type"];
  name?: string;
  index?: number;
}
