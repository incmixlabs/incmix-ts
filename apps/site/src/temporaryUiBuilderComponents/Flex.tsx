import { FlexProps, FlexProps_$TSR } from "./Flex.tsr";
import { Flex as IncmixFlex, css } from "@incmix/ui";
import { ComponentInformation } from "@incmix/utils";
import { Show } from "solid-js";
import { dndzone } from "@incmix/solid-dnd-directive";
dndzone;

export const Flex = (props: FlexProps) => {
  return (
    <Show
      when={props["__incmix-In-Edit-Mode"]}
      fallback={<IncmixFlex padding="$4" bg="$neutral10" {...props} />}
    >
      <IncmixFlex
        {...props}
        padding="$4"
        bg="$neutral10"
        gap="$4"
        onClick={(e) => {
          props.onClick?.(e);
          props["__incmix-Builder-Props"].onClick();
          e.stopPropagation();
        }}
      >
        <div
          use:dndzone={props["__incmix-Builder-Props"].dndzoneProps}
          on:consider={props["__incmix-Builder-Props"].onConsider}
          on:finalize={props["__incmix-Builder-Props"].onFinalize}
        >
          {props.children}
        </div>
      </IncmixFlex>
    </Show>
  );
};

export const FlexInformation: ComponentInformation<FlexProps> = {
  id: "flex",
  component: Flex,
  name: "Flex",
  description: "A Flex component",
  importLine: 'import { Flex } from "@incmix/ui"',
  initialProps: {
    children: "Flex",
  },
  tsRuntimeObject: FlexProps_$TSR,
  supportsChildren: true,
};
