import { PageWrapperProps, PageWrapperProps_$TSR } from "./PageWrapper.tsr";
import { ComponentInformation } from "@incmix/utils";
import { createEffect, Show } from "solid-js";
import { dndzone } from "@incmix/solid-dnd-directive";
dndzone;

export const PageWrapper = (props: PageWrapperProps) => {
  return (
    <Show when={props["__incmix-In-Edit-Mode"]} fallback={<div {...props} />}>
      <div
        {...props}
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
      </div>
    </Show>
  );
};

export const PageWrapperInformation: ComponentInformation<PageWrapperProps> = {
  id: "pageWrapper",
  component: PageWrapper,
  name: "PageWrapper",
  description: "A PageWrapper component",
  importLine: 'import { PageWrapper } from "@incmix/ui"',
  initialProps: {
    children: "PageWrapper",
  },
  tsRuntimeObject: PageWrapperProps_$TSR,
  supportsChildren: true,
};
