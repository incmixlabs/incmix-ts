import { TsRuntimeObject } from "../../..";
import { Invalid } from "./Invalid";

/**
 * An invalid node that has at least one invalid child node.
 * This node represents the invalidity of any part of a form
 * which is iteratively or recursively defined, or which has children
 */
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
