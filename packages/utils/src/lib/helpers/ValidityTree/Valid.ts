import { ValidityTree } from "./ValidityTree";

/**
 * This node is returned by the validator when the data is valid with respect
 * to the TSR object
 */
export class Valid implements ValidityTree {
  readonly valid: true = true;
}
