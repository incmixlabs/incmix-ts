import { Input } from "@incmix/ui";

import { WidgetProps } from "./WidgetProps";

const TextWidget = (props: WidgetProps) => {
  return (
    <label>
      <p>
        {props.label}
        {props.isRequired ? " * " : ""}
      </p>
      <Input
        value={props.value}
        onInput={(e) => {
          props.onChange(e.currentTarget.value);
        }}
      />
    </label>
  );
};

export default TextWidget;
