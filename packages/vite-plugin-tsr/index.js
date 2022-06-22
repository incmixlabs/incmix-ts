const {
  generateTSRuntimeObjectFromSourceString,
} = require("@incmix/ts.runtime");

module.exports = function viteTsrPlugin() {
  return {
    name: "vite-plugin-tsr",
    enforce: "pre",
    async transform(code, id, options) {
      return { code: generateTsRuntimeFiles(code, id, options) };
    },
  };
};

function generateTsRuntimeFiles(code, id = "", options) {
  if (id.endsWith(".tsr")) {
    // call ts.runtime API here to generate TS Runtime object from the source.
    return generateTSRuntimeObjectFromSourceString(code);
  }
}
