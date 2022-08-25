import {
  InvalidLeaf,
  LiteralTSRObj,
  Reason,
  TSRObjValidator,
  Valid,
} from "../helpers";

export const validateLiteral: TSRObjValidator<LiteralTSRObj> = (
  tsRuntimeObject,
  data
) => {
  const primitiveLiterals: readonly string[] = [
    "number",
    "string",
    "boolean",
    "bigint",
  ];

  if (
    primitiveLiterals.includes(tsRuntimeObject.literalType) &&
    tsRuntimeObject.value === data
  ) {
    return new Valid();
  } else {
    return new InvalidLeaf(
      tsRuntimeObject.type,
      new Reason(typeof data, data, tsRuntimeObject.value)
    );
  }
};
