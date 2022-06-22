import { Form } from "@incmix/tsr-form";
import { incmix } from "@incmix/ui";
import { ComponentInformation, PageComponentTree } from "@incmix/utils";
import { createEffect, createMemo } from "solid-js";

export const PropsTab = (props: {
  componentInformations: ComponentInformation<any>[];
  mutableActivePageComponentTree: { data: PageComponentTree };
}) => {
  const componentInformation = () =>
    props.componentInformations.find(
      (ci) => ci.id === props.mutableActivePageComponentTree.data.componentId
    );

  createMemo(() => {
    console.log(props.componentInformations);
    console.log(props.mutableActivePageComponentTree.data.componentId);
    console.log(componentInformation());
  });

  return (
    <incmix.div>
      <Form
        tsRuntimeObject={componentInformation().tsRuntimeObject}
        parentMutableFormData={props.mutableActivePageComponentTree.data}
        key="props"
      />
    </incmix.div>
  );
};
