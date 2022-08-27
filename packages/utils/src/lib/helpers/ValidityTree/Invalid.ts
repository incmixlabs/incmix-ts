import { TsRuntimeObject } from "../../../index";
import { ValidityTree } from "./ValidityTree";

export abstract class Invalid implements ValidityTree {
  readonly valid: false = false;

  /**
   * TSR object type which was expected by the form or section
   * of the form that has children
   */
  protected readonly expectedType!: TsRuntimeObject["type"];

  /**
   * The name of the property which this invalid node represents. This
   * usually contains the value of a TSR object property's key.
   *
   * @example
   * The following type was exported from a tsr.ts file
   * export type T = {
   *    a: number;
   * };
   * And in the web form a string was entered, the value of name
   * would be "a" as the property a expected a number not
   * a string
   */
  name?: string;

  /**
   * The index of the element which this invalid node represents. This
   * usually contains the index of this node; assuming it represents
   * a field or form which has sister elements in a list.
   *
   * @example
   * The following type was exported from a tsr.ts file
   * export type T = {
   *    a: number[];
   * };
   * And in the web form a number was entered, followed by a string.
   * The value of index would be 1 as the second entry is invalid -
   * due to it being a string instead of a number
   */
  index?: number;
}
