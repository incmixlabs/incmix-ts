import { generateId } from "@incmix/utils";
import { createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";
import { FieldProps } from "../util/FieldProps";

const PrimitiveField = (props: FieldProps) => {
  const id = generateId();

  const component = createMemo<(p: any) => any>(() => {
    if (
      props.defaultWidgets.format[props.tsRuntimeObject.format] &&
      props.tsRuntimeObject.type === "string"
    ) {
      return props.widgets[
        props.defaultWidgets.format[props.tsRuntimeObject.format]
      ];
    }
    return props.widgets[props.defaultWidgets[props.tsRuntimeObject.type]];
  });

  return (
    <Dynamic
      component={component()}
      label={props.tsRuntimeObject.title ?? props.key}
      value={props.parentMutableFormData[props.key]}
      onChange={(v) => {
        let newValueConverted: any;
        if (props.tsRuntimeObject.type === "number") {
          newValueConverted = +v;
        } else if (props.tsRuntimeObject.type === "boolean") {
          console.log("BOOLEAN");
          newValueConverted = !!v;
        } else {
          newValueConverted = v;
        }

        props.parentMutableFormData[props.key] = newValueConverted;
      }}
      error={undefined}
      isValid={undefined}
      isInvalid={undefined}
      isRequired={props.required}
    />
  );
};

export default PrimitiveField;
