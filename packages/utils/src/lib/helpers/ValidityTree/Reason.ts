/**
 * The reason for an invalid leaf node's invalidity
 */
export class Reason {
  public readonly receivedType: string;
  public readonly receivedValue: any;
  public readonly expectedValue?: any;

  /**
   * Create a reason for a leaf's invalidity
   *
   * @param receivedType
   * The type that was received - this is effectively {@code typeof data}
   * @param receivedValue
   * The erroneous data - this is effectively the value of {@code data}
   * @param expectedValue
   * An optional property that represents that a field expected
   * a particular value. This property is usually set when the data is
   * validated against a literal TSR object
   */
  constructor(receivedType: string, receivedValue: any, expectedValue?: any) {
    this.receivedType = receivedType;
    this.receivedValue = receivedValue;
    this.expectedValue = expectedValue;
  }
}
