import { TsRuntimeObject } from "../../..";
import { Invalid } from "./Invalid";
import { Reason } from "./Reason";

export class InvalidLeaf extends Invalid {
  public static readonly valid: false = false;
  public readonly expectedType: TsRuntimeObject["type"];
  public name?: string;
  public index?: number;

  readonly reason: Reason;

  constructor(
    expectedType: TsRuntimeObject["type"],
    reason: Reason,
    params?: { name?: string; index?: number }
  ) {
    super();
    this.expectedType = expectedType;
    this.reason = reason;
    this.name = params?.name;
    this.index = params?.index;
  }
}
