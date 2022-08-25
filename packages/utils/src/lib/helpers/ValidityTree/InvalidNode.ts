import { TsRuntimeObject } from "../../..";
import { Invalid } from "./Invalid";

export class InvalidNode extends Invalid {
  public static readonly valid: false = false;
  public readonly expectedType: TsRuntimeObject["type"];
  public name?: string;
  public index?: number;

  readonly children: readonly Invalid[];

  constructor(
    expectedType: TsRuntimeObject["type"],
    children: readonly Invalid[],
    params?: { name?: string; index?: number }
  ) {
    super();
    this.expectedType = expectedType;
    this.children = children;
    this.name = params?.name;
    this.index = params?.index;
  }
}
