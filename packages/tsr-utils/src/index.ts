export type TsRuntimeObject = any;

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

    if (tsRuntimeObject.$$generics) {
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
    return validateExtendsTsRuntimeObject(this.tsRuntimeObject, tsRuntime);
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
  const shouldApplyValue = params.shouldApply(params.tsRuntimeObject);

  if (shouldApplyValue) {
    return params.transform(params.tsRuntimeObject);
  }

  if (params.tsRuntimeObject.type === "object") {
    const keys = Object.keys(params.tsRuntimeObject.properties);

    return {
      ...params.tsRuntimeObject,
      properties: Object.fromEntries(
        keys.map((key) => [
          key,
          transformTsRuntimeObject({
            ...params,
            tsRuntimeObject: params.tsRuntimeObject.properties[key],
          }),
        ])
      ),
    };
  }

  if (params.tsRuntimeObject.type === "array") {
    return {
      ...params.tsRuntimeObject,
      items: transformTsRuntimeObject({
        ...params,
        tsRuntimeObject: params.tsRuntimeObject.items,
      }),
    };
  }

  // TODO: WRAP ENUMS AND OTHER DATASTRUCTURES

  return params.tsRuntimeObject;
};
