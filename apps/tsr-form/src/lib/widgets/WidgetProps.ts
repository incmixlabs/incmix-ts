import type { TsRuntimeObject } from "@incmix/ts.runtime";
import { Component } from "solid-js";

export type WidgetProps = {
  value: any;
  onChange: (value: any) => void;
  label: string;
  error?: string;
  isValid: boolean;
  isInvalid: boolean;
  isRequired: boolean;
};

export type EnumWidgetProps = WidgetProps & {
  items: TsRuntimeObject[];
};

export type Widgets = {
  [key: string]: Component<any>;
};

export type DefaultWidgets = {
  string: string;
  number: string;
  boolean: string;
  enum: string;
  format: {
    [key: string]: string;
  };
};
