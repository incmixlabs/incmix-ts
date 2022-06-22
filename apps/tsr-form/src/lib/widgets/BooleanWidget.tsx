import { Switch } from "@incmix/ui";
import { createEffect } from "solid-js";

import { WidgetProps } from "./WidgetProps";

const BooleanWidget = (props: WidgetProps) => {
  createEffect(() => {
    console.log("BooleanWidget PROPS");
    console.log(props);
  });
  return (
    <label class="flex gap">
      <Switch checked={props.value} onInput={props.onChange} />
      <p>
        {props.label}
        {props.isRequired ? " * " : ""}
      </p>
    </label>
  );
};

export default BooleanWidget;
