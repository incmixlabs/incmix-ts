import { ButtonProps, ButtonProps_$TSR } from "./Button.tsr";
import { Button as IncmixButton } from "@incmix/ui";
import { ComponentInformation, IncmixEditableProps } from "@incmix/utils";
import { createEffect, Show } from "solid-js";
import { dndzone } from "@incmix/solid-dnd-directive";
dndzone;

export const Button = (props: ButtonProps & IncmixEditableProps) => {
  createEffect(() => {
    console.log(JSON.stringify(props));
  });
  return (
    <Show
      when={props["__incmix-In-Edit-Mode"]}
      fallback={<IncmixButton {...props} />}
    >
      <div
        onClick={(e) => {
          props["__incmix-Builder-Props"].onClick();
          e.stopPropagation();
        }}
        style="display: inline-block;"
      >
        <IncmixButton pointerEvents="none" {...props}>
          {props.children}
        </IncmixButton>
      </div>
    </Show>
  );
};

export const ButtonInformation: ComponentInformation<ButtonProps> = {
  id: "button",
  component: Button,
  name: "Button",
  description: "A button component",
  importLine: 'import { Button } from "@incmix/ui"',
  initialProps: {
    children: "Button",
  },
  tsRuntimeObject: ButtonProps_$TSR,
  supportsChildren: false,
};
