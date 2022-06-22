import { Dynamic } from "solid-js/web";
import { FieldProps } from "../util/FieldProps";

const UnionField = (props: FieldProps) => {
  return (
    <Dynamic
      component={props.widgets[props.defaultWidgets.enum]}
      label={props.tsRuntimeObject.title ?? props.key}
      value={"" + (props.parentMutableFormData[props.key] ?? "")}
      items={props.tsRuntimeObject.values}
      onChange={(v) => {
        let newValueConverted: any;
        if (props.tsRuntimeObject.type === "number") {
          newValueConverted = +v;
        } else if (props.tsRuntimeObject.type === "boolean") {
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

export default UnionField;
