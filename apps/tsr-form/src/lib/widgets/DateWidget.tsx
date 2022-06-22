import { Input } from "@incmix/ui";

import { WidgetProps } from "./WidgetProps";

const DateWidget = (props: WidgetProps) => {
  return (
    <label>
      <p>
        {props.label}
        {props.isRequired ? " * " : ""}
      </p>
      <Input
        type="date"
        value={props.value}
        onInput={(e) => {
          props.onChange(e.currentTarget.value);
        }}
      />
    </label>
  );
};

export default DateWidget;
