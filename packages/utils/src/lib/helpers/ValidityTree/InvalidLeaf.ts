import { TsRuntimeObject } from "../../..";
import { Invalid } from "./Invalid";
import { Reason } from "./Reason";

/**
 * This type of node represents any invalid field which is neither recursively
 * nor iteratively defined, and doesn't have children
 */
export class InvalidLeaf extends Invalid {
  public static readonly valid: false = false;
  public readonly expectedType: TsRuntimeObject["type"];
  public name?: string;
  public index?: number;

  /**
   * The reason for this field being invalid
   */
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
