import {
  Select,
  SelectContent,
  SelectIcon,
  SelectListbox,
  SelectOption,
  SelectOptionIndicator,
  SelectOptionText,
  SelectPlaceholder,
  SelectTrigger,
  SelectValue,
  Text,
} from "@incmix/ui";
import { createMemo, For } from "solid-js";

import { EnumWidgetProps } from "./WidgetProps";

const SelectWidget = (props: EnumWidgetProps) => {
  createMemo(() => {
    console.log(
      "🚀 ~ file: SelectWidget.tsx ~ line 5 ~ SelectWidget ~ props.items",
      props.items
    );
  });

  return (
    <label>
      {/* <p>
        {props.label}
        {props.isRequired ? " * " : ""}
      </p>
      <Select
        value={props.value}
        onInput={(e) => {
          props.onChange(e);
        }}
        items={props.items.map((i) => ({
          text: i.value,
          id: i.value,
        }))}
      /> */}

      <>
        <Text mb="$2">Value: {props.value}</Text>
        <Select value={props.value} onChange={props.onChange}>
          <SelectTrigger>
            <SelectPlaceholder>Choose a framework</SelectPlaceholder>
            <SelectValue />
            <SelectIcon />
          </SelectTrigger>
          <SelectContent>
            <SelectListbox>
              <For each={props.items}>
                {(item) => (
                  <SelectOption value={item.value}>
                    <SelectOptionText>{item.value}</SelectOptionText>
                    <SelectOptionIndicator />
                  </SelectOption>
                )}
              </For>
            </SelectListbox>
          </SelectContent>
        </Select>
      </>
    </label>
  );
};

export default SelectWidget;
