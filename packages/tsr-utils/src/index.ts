export type TsRuntimeObjectGeneric = {
  readonly name: string;
  readonly extends: TsRuntimeObject;
};

export type GlobalTsRuntimeObjectKeys = {
  readonly generics?: TsRuntimeObjectGeneric[];
  readonly id: string;
  readonly documentation?: string;
};

export type FunctionTsRuntimeObject = {
  readonly type: "function";
  readonly functionGenerics?: TsRuntimeObjectGeneric[];
} & GlobalTsRuntimeObjectKeys;

export type ObjectTsRuntimeObject = {
  readonly type: "object";
  readonly properties: {
    [key: string]: TsRuntimeObject;
  };
} & GlobalTsRuntimeObjectKeys;

export type ArrayTsRuntimeObject = {
  readonly type: "array";
  readonly items: TsRuntimeObject;
} & GlobalTsRuntimeObjectKeys;

export type TupleTsRuntimeObject = {
  readonly type: "tuple";
  readonly items: (
    | {
        readonly spread: true;
        readonly tsRuntimeObject: ArrayTsRuntimeObject | TupleTsRuntimeObject;
      }
    | {
        readonly spread: false;
        readonly tsRuntimeObject: TsRuntimeObject;
      }
  )[];
} & GlobalTsRuntimeObjectKeys;

export type NumberLiteralTsRuntimeObject = {
  readonly type: "literal";
  readonly literalType: "number";
  readonly value: number;
} & GlobalTsRuntimeObjectKeys;

export type StringLiteralTsRuntimeObject = {
  readonly type: "literal";
  readonly literalType: "string";
  readonly value: string;
} & GlobalTsRuntimeObjectKeys;

export type BooleanLiteralTsRuntimeObject = {
  readonly type: "literal";
  readonly literalType: "boolean";
  readonly value: boolean;
} & GlobalTsRuntimeObjectKeys;

export type BigIntLiteralTsRuntimeObject = {
  readonly type: "literal";
  readonly literalType: "bigint";
  readonly value: bigint;
} & GlobalTsRuntimeObjectKeys;

export type UniqueSymbolTsRuntimeObject = {
  readonly type: "literal";
  readonly literalType: "symbol";
  readonly value: unique symbol;
} & GlobalTsRuntimeObjectKeys;

export type NumberTsRuntimeObject = {
  readonly type: "number";
} & GlobalTsRuntimeObjectKeys;

export type StringTsRuntimeObject = {
  readonly type: "string";
} & GlobalTsRuntimeObjectKeys;

export type BooleanTsRuntimeObject = {
  readonly type: "boolean";
} & GlobalTsRuntimeObjectKeys;

export type BigIntTsRuntimeObject = {
  readonly type: "bigint";
} & GlobalTsRuntimeObjectKeys;

export type SymbolTsRuntimeObject = {
  readonly type: "symbol";
} & GlobalTsRuntimeObjectKeys;

export type TsRuntimeObject =
  | FunctionTsRuntimeObject
  | ObjectTsRuntimeObject
  | ArrayTsRuntimeObject
  | TupleTsRuntimeObject
  | NumberLiteralTsRuntimeObject
  | StringLiteralTsRuntimeObject
  | BooleanLiteralTsRuntimeObject
  | BigIntLiteralTsRuntimeObject
  | UniqueSymbolTsRuntimeObject
  | NumberTsRuntimeObject
  | StringTsRuntimeObject
  | BooleanTsRuntimeObject
  | BigIntTsRuntimeObject
  | SymbolTsRuntimeObject;

export const validateTsRuntimeObject = (
  tsRuntimeObject: TsRuntimeObject,
  data: any
): boolean => {
  return false;
};

export const validateExtendsTsRuntimeObject = (
  tsRuntimeObject: TsRuntimeObject,
  extendsTsRuntimeObject: TsRuntimeObject
): boolean => {
  return false;
};

export class TsRuntime {
  tsRuntimeObject: TsRuntimeObject;

  constructor(tsRuntimeObject: TsRuntimeObject) {
    this.tsRuntimeObject = tsRuntimeObject;
  }

  static fromTsRuntimeObject(tsRuntimeObject: TsRuntimeObject) {
    // Check if it's generic: TODO: MAKE SURE IT'S ACCURATE

    if (tsRuntimeObject.generics) {
      return new GenericTsRuntime(tsRuntimeObject);
    }

    return new ConcreteTsRuntime(tsRuntimeObject);
  }
}

export class ConcreteTsRuntime extends TsRuntime {
  validate(data: any) {
    return validateTsRuntimeObject(this.tsRuntimeObject, data);
  }

  validateExtends(tsRuntime: ConcreteTsRuntime) {
    return validateExtendsTsRuntimeObject(
      this.tsRuntimeObject,
      tsRuntime.tsRuntimeObject
    );
  }
}

export class GenericTsRuntime extends TsRuntime {
  toConcrete(...params: ConcreteTsRuntime[]): ConcreteTsRuntime {
    // TODO: GET ACTUAL Array of Generics
    const generics: ConcreteTsRuntime[] = [];

    if (generics.length !== params.length) {
      throw new Error(
        `This GenericTsRuntime requires ${generics.length} generics whereas you provided ${params.length}`
      );
    }

    for (let index = 0; index < params.length; index++) {
      const generic = generics[index];
      const param = params[index];

      if (!generic.validateExtends(param)) {
        throw new Error(
          `Param at index ${index} doesn't extend the generic at the corresponding index`
        );
      }
    }

    // TODO: Implement the actual logic after figuring out how generics are implemented
    throw new Error("This function isn't yet implemented yet");
  }
}

export const transformTsRuntimeObject = (params: {
  tsRuntimeObject: TsRuntimeObject;
  shouldApply: (tsr: TsRuntimeObject) => boolean;
  transform: (tsr: TsRuntimeObject) => TsRuntimeObject;
}): TsRuntimeObject => {
  const { tsRuntimeObject, transform, shouldApply } = params;
  const shouldApplyValue = shouldApply(tsRuntimeObject);

  if (shouldApplyValue) {
    return transform(tsRuntimeObject);
  }

  if (tsRuntimeObject.type === "object") {
    const keys = Object.keys(tsRuntimeObject.properties);

    return {
      ...tsRuntimeObject,
      properties: Object.fromEntries(
        keys.map((key) => [
          key,
          transformTsRuntimeObject({
            ...params,
            tsRuntimeObject: tsRuntimeObject.properties[key],
          }),
        ])
      ),
    };
  }

  if (tsRuntimeObject.type === "array") {
    return {
      ...tsRuntimeObject,
      items: transformTsRuntimeObject({
        ...params,
        tsRuntimeObject: tsRuntimeObject.items,
      }),
    };
  }

  if (tsRuntimeObject.type === "tuple") {
    return {
      ...tsRuntimeObject,
      items: tsRuntimeObject.items.map((item) => ({
        ...item,

        // TODO: Figure out how to remove the `as ArrayTsRuntimeObject`
        // TODO: this is actually a potential edge case. If the user were to process arrays and return a non array it would break the fact that this is spread
        tsRuntimeObject: transformTsRuntimeObject({
          shouldApply,
          transform,
          tsRuntimeObject: item.tsRuntimeObject,
        }) as ArrayTsRuntimeObject,
      })),
    };
  }

  // TODO: WRAP ENUMS AND OTHER DATASTRUCTURES

  return tsRuntimeObject;
};
