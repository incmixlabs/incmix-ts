import { MutableActivePage } from "~/lib/MutableActivePage";
import { Heading, Box, incmix } from "@incmix/ui";
import { PageComponentTree } from "@incmix/utils";
import { Component, For, Show } from "solid-js";
import { dndzone } from "solid-dnd-directive";
dndzone;

export const TreeTab = (props: {
  mutableActivePage: MutableActivePage;
  componentRegistry: {
    [key: string]: Component;
  };
  mutableActivePageComponentTree: { data: PageComponentTree | null };
}) => {
  return (
    <div>
      <Heading level="2">Tree</Heading>

      <PageTreeRenderer
        componentRegistry={props.componentRegistry}
        dataTree={props.mutableActivePage.data.pageData}
        mutableActivePageComponentTree={props.mutableActivePageComponentTree}
      />
    </div>
  );
};

const PageTreeRenderer = (props: {
  dataTree: PageComponentTree;
  componentRegistry: {
    [key: string]: Component;
  };
  mutableActivePageComponentTree: { data: PageComponentTree | null };
}) => {
  return (
    <div>
      <Box
        onClick={() => {
          props.mutableActivePageComponentTree.data = props.dataTree;
        }}
      >
        {props.dataTree.componentId}
      </Box>
      <incmix.div paddingLeft="$4">
        {/* TODO: Update this to be based on whether it supports children */}
        <Show when={props.dataTree.children}>
          <div
            use:dndzone={{
              items: () => props.dataTree.children,
            }}
            on:consider={(e) => {
              const { items: newItems } = e.detail;
              props.dataTree.children = newItems;
            }}
            on:finalize={(e) => {
              const { items: newItems } = e.detail;
              props.dataTree.children = newItems;
            }}
          >
            <For each={props.dataTree.children}>
              {(child) => (
                <PageTreeRenderer
                  dataTree={child}
                  componentRegistry={props.componentRegistry}
                  mutableActivePageComponentTree={
                    props.mutableActivePageComponentTree
                  }
                />
              )}
            </For>
          </div>
        </Show>
      </incmix.div>
    </div>
  );
};
