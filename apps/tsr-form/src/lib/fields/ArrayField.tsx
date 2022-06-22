import type { TsRuntimeObject } from "@incmix/ts.runtime";
import { createEffect } from "solid-js";

import { FormData, SchemaPath } from "../util/FormData";
import { DefaultWidgets, Widgets } from "../widgets/WidgetProps";

const ArrayField = (props: {
  schema: TsRuntimeObject & {
    type: "array";
  };
  formData: FormData;
  schemaPath: SchemaPath;
  setFormData: (...args: any[]) => void;
  widgets: Widgets;
  defaultWidgets: DefaultWidgets;
  required: boolean;
}) => {
  createEffect(() => {
    if (props.formData === undefined || props.formData === null) {
      props.setFormData(...props.schemaPath, []);
    }
  });
  return (
    // <Form.Input.GroupArray
    //   onMove={({ direction, item }) => {}}
    //   onAdd={() => {
    //     props.setFormData(...props.schemaPath, [
    //       ...(props.formData as any[]),
    //       undefined,
    //     ]);
    //   }}
    //   onDelete={(item) => {
    //     props.setFormData(
    //       ...props.schemaPath,
    //       (props.formData as any[]).filter((i) => i !== item)
    //     );
    //   }}
    //   label={props.schema?.title || "" + props.schemaPath.at(-1)}
    //   description={props.schema?.description}
    //   items={props.formData as any[]}
    // >
    //   {({ item, index }) => (
    //     <Field
    //       schema={props.schema.items as any}
    //       schemaPath={[...props.schemaPath, index()]}
    //       formData={props.formData?.[index()]}
    //       setFormData={props.setFormData}
    //       widgets={props.widgets}
    //       defaultWidgets={props.defaultWidgets}
    //       required={false}
    //     />
    //   )}
    // </Form.Input.GroupArray>
    <></>
  );
};

export default ArrayField;
