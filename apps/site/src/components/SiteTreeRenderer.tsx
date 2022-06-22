import {
  ComponentInformation,
  generateId,
  PageComponentTree,
} from "@incmix/utils";
import { Component, createEffect, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { SHADOW_PLACEHOLDER_ITEM_ID } from "solid-dnd-directive";

export const SiteTreeRenderer = (props: {
  pageData: PageComponentTree;
  componentRegistry: { [id: string]: Component<any> };
  componentInformations: ComponentInformation<any>[];
  mutableActivePageComponentTree: { data: PageComponentTree | null };
  inEditMode: boolean;
}) => {
  const componentInformation = () =>
    props.componentInformations.find(
      (c) => c.id === props.pageData.componentId
    );

  const children = () =>
    props.pageData.children?.length
      ? props.pageData.children
      : [{ empty: true, id: generateId() }];

  return (
    <Show
      when={componentInformation().supportsChildren}
      fallback={
        <Dynamic
          component={props.componentRegistry[props.pageData.componentId]}
          {...props.pageData.props}
          __incmix-In-Edit-Mode={true}
          __incmix-Builder-Props={{
            onClick: () => {
              console.log("Updating active component");
              props.mutableActivePageComponentTree.data = props.pageData;
            },
          }}
        />
      }
    >
      <Dynamic
        component={props.componentRegistry[props.pageData.componentId]}
        {...props.pageData.props}
        __incmix-In-Edit-Mode={props.inEditMode}
        __incmix-Builder-Props={{
          dndzoneProps: {
            items: children,
            centreDraggedOnCursor: true,
          },
          onConsider(e: any) {
            props.pageData.children = e.detail.items;
          },
          onFinalize(e: any) {
            props.pageData.children = e.detail.items.filter(
              (item) => !item.empty
            );
          },
          onClick() {
            console.log("Updating active component");
            props.mutableActivePageComponentTree.data = props.pageData;
          },
        }}
      >
        <For
          each={children().filter(
            (item) => item.id !== SHADOW_PLACEHOLDER_ITEM_ID
          )}
        >
          {(child) => (
            <Show when={!child.empty} fallback={<div>EMPTY</div>}>
              <SiteTreeRenderer
                pageData={child}
                componentRegistry={props.componentRegistry}
                componentInformations={props.componentInformations}
                mutableActivePageComponentTree={
                  props.mutableActivePageComponentTree
                }
                inEditMode={props.inEditMode}
              />
            </Show>
          )}
        </For>
      </Dynamic>
    </Show>
  );
};
