import { TsRuntimeObject } from "@incmix/ts.runtime";
import { createEffect, For, Show } from "solid-js";
import { FieldProps } from "../util/FieldProps";

import { FormData, SchemaPath } from "../util/FormData";
import { DefaultWidgets, Widgets } from "../widgets/WidgetProps";
import Field from "./Field";

// TODO: Include in UI
const InputGroup = (props: any) => (
  <div>
    <p>{props.title}</p>
    <p>{props.description}</p>
    {props.children}
  </div>
);

const ObjectField = (props: FieldProps) => {
  // createEffect(() => {
  //   if (props.formData === undefined || props.formData === null) {
  //     console.log("updating to empty object");
  //     console.log(props.schemaPath);
  //     props.setFormData(...props.schemaPath, {});
  //   }
  // });

  return (
    <InputGroup
      label={props.tsRuntimeObject?.title || "" + props.key}
      description={props.tsRuntimeObject?.description}
    >
      <For each={Object.keys(props.tsRuntimeObject?.properties ?? {})}>
        {(key) => {
          return (
            <Field
              tsRuntimeObject={props.tsRuntimeObject.properties[key]}
              required={props.tsRuntimeObject.required?.includes(key)}
              key={key}
              parentMutableFormData={props.parentMutableFormData[props.key]}
              widgets={props.widgets}
              defaultWidgets={props.defaultWidgets}
            />
          );
        }}
      </For>
    </InputGroup>
  );
};

export default ObjectField;
