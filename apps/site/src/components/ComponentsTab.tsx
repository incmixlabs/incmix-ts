import { ComponentInformation, pageH, withId } from "@incmix/utils";
import { Component, createSignal } from "solid-js";
import { For } from "solid-js";
import { Dynamic } from "solid-js/web";
import { MutableActivePage } from "~/lib/MutableActivePage";
import { dndzone } from "@incmix/solid-dnd-directive";
dndzone;

export const ComponentsTab = (props: {
  mutableActivePage: MutableActivePage;
  componentInformations: ComponentInformation<any>[];
  componentRegistry: { [id: string]: Component<any> };
}) => {
  const getComponentData = () =>
    props.componentInformations.map((c) => pageH(c));

  // this isn't reactive, but it's not a big deal for now.
  // potentially it might need to be reactive in the future
  const [componentData, setComponentData] = createSignal(getComponentData());
  return (
    <div
      use:dndzone={{
        items: componentData,
      }}
      on:consider={(e) => {
        const { items: newItems } = e.detail;
        setComponentData(newItems);
      }}
      on:finalize={(e) => {
        const { items: newItems } = e.detail;
        setComponentData(getComponentData().map((item) => withId(item)));
      }}
    >
      <For each={componentData()}>
        {(pageData) => (
          <Dynamic
            component={props.componentRegistry[pageData.componentId]}
            {...pageData.props}
          />
        )}
      </For>
    </div>
  );
};
