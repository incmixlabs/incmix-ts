import { Input } from "@incmix/ui";

import { WidgetProps } from "./WidgetProps";

const NumberWidget = (props: WidgetProps) => {
  return (
    <label>
      <p>
        {props.label}
        {props.isRequired ? " * " : ""}
      </p>

      <Input
        type="number"
        value={props.value}
        onInput={(e) => {
          props.onChange(e.currentTarget.value);
        }}
      />
    </label>
  );
};

export default NumberWidget;
