import { DefaultWidgets, Widgets } from "../widgets/WidgetProps";

export type FieldProps = {
  tsRuntimeObject: any; // TODO: TsRuntimeObject
  parentMutableFormData: FormData;
  key: string;
  widgets: Widgets;
  defaultWidgets: DefaultWidgets;
  required: boolean;
};
