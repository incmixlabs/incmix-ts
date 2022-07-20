import { Plugin } from "vite";

const {
  transform,
} = require("@incmix/ts.runtime");

export function viteTsrPlugin(): Plugin {
  return {
    name: "vite-plugin-tsr",
    enforce: "pre",
    async transform(code, id, options) {
      return { code: transform(code, id, options) };
    },
  };
}

function generateTsRuntimeFiles(code: string, id = "", options) {
  if (id.endsWith(".tsr")) {
    // call ts.runtime API here to generate TS Runtime object from the source.
    return transform(code);
  }
}
