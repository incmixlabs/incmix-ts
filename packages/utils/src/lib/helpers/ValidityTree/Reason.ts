export class Reason {
  public readonly receivedType: string;
  public readonly receivedValue: any;
  public readonly expectedValue?: any;

  constructor(receivedType: string, receivedValue: any, expectedValue?: any) {
    this.receivedType = receivedType;
    this.receivedValue = receivedValue;
    this.expectedValue = expectedValue;
  }
}
