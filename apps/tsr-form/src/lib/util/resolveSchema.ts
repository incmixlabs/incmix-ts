import { TsSchema } from "@incmix/ts-schema";
import Ajv from "ajv";
import clonedeep from "lodash.clonedeep";
import mapvalues from "lodash.mapvalues";
import mergeJsonSchemas from "merge-json-schemas";

import { FormData } from "./FormData";

const ajv = new Ajv();

// Weird example #1 that doesn't make any sense
// {
//     "type": "object",
//     "oneOf": [
//       {
//         "type": "string"
//       }
//     ]
//   }
//
// if passed a schema like this it won't be expected to resolve to any resonable value,
// because there isn't one.

const getOneAnyOfLabel =
  (type: "one" | "any") => (oneAnyOf: any, index: number) => {
    return (
      oneAnyOf.title ??
      oneAnyOf.description ??
      oneAnyOf.type ??
      `Option ${index + 1}`
    );
  };

const findOneAnyOf =
  (type: "one" | "any") => (oneOfString: string, obj: any) => {
    return obj[`${type}Of`]?.find((oneOf, index) => {
      return getOneAnyOfLabel(type)(oneOf, index) === oneOfString;
    });
  };

const getOneOfLabel = getOneAnyOfLabel("one");
export const findOneOf = findOneAnyOf("one");

const getAnyOfLabel = getOneAnyOfLabel("any");
const findAnyOf = findOneAnyOf("any");

type ResolveSchemaInput = {
  schema: TsSchema;
  formData: FormData;
  anyOf?: string;
  oneOf?: string;
};

const resolveSchemaBasicField =
  (fieldName: string) => (sources: TsSchema[]) => {
    for (const source of sources) {
      if (source?.[fieldName]) {
        return source[fieldName];
      }
    }
    return null;
  };
const resolveSchemaType = resolveSchemaBasicField("type");
const resolveSchemaTitle = resolveSchemaBasicField("title");
const resolveSchemaDescription = resolveSchemaBasicField("description");

const resolveSchemaFromSources = (sources: TsSchema[]) => {
  const newPropertyNames = [
    ...new Set(
      sources.flatMap((source) => {
        return Object.keys(source?.properties ?? {});
      })
    ),
  ];

  const basicMerge = Object.assign({}, ...sources);

  return {
    ...basicMerge,
    type: resolveSchemaType(sources),
    title: resolveSchemaTitle(sources),
    description: resolveSchemaDescription(sources),
    properties: newPropertyNames.length
      ? Object.fromEntries(
          newPropertyNames.map((name) => {
            return [
              name,
              resolveSchemaFromSources(
                sources
                  .map((source) => source?.properties?.[name])
                  .filter((source) => source)
              ),
            ];
          })
        )
      : undefined,
  };
};

export const resolveSchema = (
  params: ResolveSchemaInput
): {
  schema: TsSchema;
  anyOf?: string[];
  oneOf?: string[];
} => {
  console.log("resolveSchema", params);

  let anyOfSchema: TsSchema | undefined;
  let oneOfSchema: TsSchema | undefined;
  let allOfSchemas: readonly TsSchema[] = params.schema.allOf;
  if (!Array.isArray(allOfSchemas)) {
    allOfSchemas = [];
  }
  const oldSchema = clonedeep(params.schema);

  if (params.anyOf) {
    anyOfSchema = findAnyOf(params.anyOf, params.schema);
  }

  if (params.oneOf) {
    oneOfSchema = findOneOf(params.oneOf, params.schema);
  }

  let sources = [...allOfSchemas, anyOfSchema, oneOfSchema, oldSchema];

  for (const source of sources) {
    if (source?.if) {
      const ifSchema = source.if;
      try {
        if (ajv.validate(ifSchema, params.formData)) {
          sources = [...sources, source.then];
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  const newSchema = resolveSchemaFromSources(sources);
  //const newSchema = mergeJsonSchemas(sources);
  //const newSchema = {}
  return {
    anyOf: oldSchema?.anyOf?.map?.(getAnyOfLabel),
    oneOf: oldSchema?.oneOf?.map?.(getOneOfLabel),
    schema: newSchema,
  };
};

// export const resolveSchema = () => {
//   console.log("BLABLABLA");
//   return {};
// };
