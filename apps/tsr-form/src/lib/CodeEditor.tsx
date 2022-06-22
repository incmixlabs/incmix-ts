import * as monaco from "monaco-editor";
//@ts-ignore
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
//@ts-ignore
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
//@ts-ignore
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
//@ts-ignore
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
//@ts-ignore
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { createEffect, createSignal, JSX, untrack } from "solid-js";

//@ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, label: any) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};
monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: false,
  noSyntaxValidation: false,
});

const codeModel = monaco.editor.createModel(
  "",
  "json",
  monaco.Uri.file("foo.json")
);

monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  //@ts-ignore
  //   jsx: "react",
  //   types: ["tsxComponents"],
  //   lib: ["ESNext"],
});

const CodeEditor = (props: {
  value: string;
  onChange: (s: string) => void;
}): JSX.Element => {
  createEffect(() => {
    const editor = monaco.editor.create(
      document.getElementById("the-code-editor")!,
      {
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 8,
        },
      }
    );

    editor.setModel(codeModel);

    editor.onDidChangeModelContent(() => {
      props.onChange(editor.getValue());
    });

    createEffect(() => {
      if (props.value === editor.getValue()) return;
      editor.setValue(props.value);
    });
  });

  return <div id="the-code-editor" class="h-full w-full"></div>;
};

export default CodeEditor;
