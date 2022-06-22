import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  Show,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { FieldProps } from "../util/FieldProps";

import { FormData, SchemaPath } from "../util/FormData";
import { findOneOf, resolveSchema } from "../util/resolveSchema";
import SelectWidget from "../widgets/SelectWidget";
import { DefaultWidgets, Widgets } from "../widgets/WidgetProps";
import ArrayField from "./ArrayField";
import ObjectField from "./ObjectField";
import PrimitiveField from "./PrimitiveField";
import UnionField from "./UnionField";

const Field = (props: FieldProps) => {
  const [selectedOneOfString, setSelectedOneOfString] = createSignal("");
  const [selectedAnyOfString, setSelectedAnyOfString] = createSignal("");

  const schemaMetaData = createMemo((prev) => {
    console.log({ prev });
    console.log({ props });
    const newSchemaMetaData = resolveSchema({
      schema: props.tsRuntimeObject,
      anyOf: selectedAnyOfString(),
      oneOf: selectedOneOfString(),
      formData: props.parentMutableFormData[props.key],
    });

    console.log({ newSchemaMetaData });

    // return {};

    if (JSON.stringify(prev) === JSON.stringify(newSchemaMetaData)) {
      return prev as typeof newSchemaMetaData;
    }
    return newSchemaMetaData;
  });

  const fieldComponent = createMemo(() => {
    // const { schema } = schemaMetaData();
    // console.log({schema})

    const schema = props.tsRuntimeObject;

    console.log({schema});

    if (
      schema.type === "union" &&
      (schema.values as any[])?.every?.((e) => e.type === "primitive")
    ) {
      return UnionField;
    }

    if (schema.type === "object") {
      return ObjectField;
    }

    if (
      schema.type === "string" ||
      schema.type === "number" ||
      schema.type === "boolean"
    ) {
      return PrimitiveField;
    }

    if (schema.type === "array" && schema.items) {
      return ArrayField;
    }

    return () => <p>Unsupported Schema</p>;
  });

  createEffect(() => {
    const d = props.parentMutableFormData[props.key];
    if (d === undefined || d === null) {
      props.parentMutableFormData[props.key] = schemaMetaData().schema.default;
    }
  });

  return (
    <>
      <Show when={schemaMetaData()?.oneOf}>
        <SelectWidget
          value={selectedOneOfString()}
          onChange={(e) => {
            setSelectedOneOfString(e);

            for (const oneOf of schemaMetaData().oneOf) {
              if (oneOf !== e) {
                console.log(oneOf);
                console.log(findOneOf(oneOf, props.tsRuntimeObject));
                for (const property of Object.keys(
                  findOneOf(oneOf, props.tsRuntimeObject)?.properties ?? {}
                )) {
                  props.parentMutableFormData[props.key][property] = undefined;
                }
              }
            }
          }}
          items={schemaMetaData().oneOf}
          label={schemaMetaData().schema.title}
          isRequired={props.required}
          isValid={false}
          isInvalid={false}
        />
      </Show>

      <Show when={schemaMetaData()?.anyOf}>
        <SelectWidget
          value={selectedAnyOfString()}
          onChange={(e) => {
            setSelectedAnyOfString(e);
          }}
          items={schemaMetaData().anyOf}
          label={schemaMetaData().schema.title}
          isRequired={props.required}
          isValid={false}
          isInvalid={false}
        />
      </Show>
      <Dynamic
        component={fieldComponent() as any as Component<FieldProps>}
        tsRuntimeObject={schemaMetaData()?.schema}
        parentMutableFormData={props.parentMutableFormData}
        key={props.key}
        widgets={props.widgets}
        defaultWidgets={props.defaultWidgets}
        required={props.required}
      />
    </>
  );
};

export default Field;
