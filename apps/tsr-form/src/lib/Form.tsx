import { Button } from "@incmix/ui";
import Ajv from "ajv";
import { createSignal, mergeProps, Show } from "solid-js";

import Field from "./fields/Field";
import { FormData } from "./util/FormData";
import BooleanWidget from "./widgets/BooleanWidget";
import DateWidget from "./widgets/DateWidget";
import NumberWidget from "./widgets/NumberWidget";
import SelectWidget from "./widgets/SelectWidget";
import TextWidget from "./widgets/TextWidget";
import { DefaultWidgets, Widgets } from "./widgets/WidgetProps";

const ajv = new Ajv();

function Form(props: {
  tsRuntimeObject: any; // TODO: TsRuntimeObject
  onSubmit?: () => void;
  parentMutableFormData: FormData;
  key: string;
  widgets?: Widgets;
  defaultWidgets?: DefaultWidgets;
}) {
  const local = mergeProps(props, {
    widgets: {
      TextWidget,
      NumberWidget,
      BooleanWidget,
      SelectWidget,
      DateWidget,
    },
    defaultWidgets: {
      string: "TextWidget",
      number: "NumberWidget",
      boolean: "BooleanWidget",
      enum: "SelectWidget",
      format: {
        date: "DateWidget",
      },
    },
  });

  const [error, setError] = createSignal(null);

  return (
    <form
      class="w-full"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        console.log("TRYING");
        // try {
        //   const validate = await ajv.compile({
        //     ...local.schema,
        //   });

        //   if (!validate(local.mutableFormData)) {
        //     setError(JSON.stringify(validate.errors));
        //     return;
        //   }
        // } catch (e) {
        //   setError(e.message);
        // }
        if (error()) {
          console.log({ error: error() });
          return;
        }
        props.onSubmit?.();
      }}
    >
      <Show when={error()}>
        <div class="text-red-500">{error()}</div>
      </Show>
      <Field
        required={false}
        tsRuntimeObject={local.tsRuntimeObject}
        parentMutableFormData={local.parentMutableFormData as any}
        key={local.key}
        widgets={local.widgets}
        defaultWidgets={local.defaultWidgets}
      />
      <Show when={props.onSubmit}>
        <Button>Submit</Button>
      </Show>
    </form>
  );
}

export default Form;
