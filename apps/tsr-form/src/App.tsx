import type { Component } from "solid-js";
import {
  createEffect,
  createMemo,
  createSignal,
  ErrorBoundary,
} from "solid-js";
import { createStore } from "solid-js/store";

import { Form } from "./lib";
import CodeEditor from "./lib/CodeEditor";

const App: Component = () => {
  const [schemaString, setSchemaString] = createSignal(
    JSON.stringify(
      {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          ageGroup: {
            enum: ["adult", "child", "teenager"],
          },
        },
      },
      null,
      2
    )
  );

  const schema = createMemo((prev) => {
    try {
      const newV = JSON.parse(schemaString());
      console.log("newV", newV);
      return newV;
    } catch (e) {
      return prev;
    }
  });

  const [formData, setFormData] = createStore({
    name: "Zachiah Ryan Sawyer",
    ageGroup: "teenager",
  });

  createEffect(() => {
    console.log(JSON.stringify(formData));
  });

  return (
    <div class="flex gap-4 h-100vh">
      <CodeEditor value={schemaString()} onChange={setSchemaString} />

      <ErrorBoundary
        fallback={(err) => () => {
          createMemo(() => console.log(err));
          return "Invalid TS Schema";
        }}
      >
        <Form
          schema={schema() as any}
          onSubmit={() => {}}
          formData={formData}
          setFormData={setFormData}
        />
      </ErrorBoundary>
    </div>
  );
};

export default App;
