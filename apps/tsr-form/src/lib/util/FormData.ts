import { createStore, Store, StoreSetter } from "solid-js/store";

type PrimitiveFormData = string | number | boolean | null | undefined;

export type SchemaPath = (string | number)[];

export type FormData =
  | PrimitiveFormData
  | FormData[]
  | { [key in string]: FormData };
