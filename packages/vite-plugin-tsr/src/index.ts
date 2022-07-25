import { Plugin } from "vite";

import { transform as tsTransform } from "@incmix/ts.runtime";
import { Failable, id as tsrId } from "@incmix/ts.runtime";

const fileExtensionRE = /\.[^\/\s\?]+$/;
const tsrExtensionRE = /\.tsr$/;
export function viteTsrPlugin(): Plugin {
  return {
    name: "vite-plugin-tsr",
    enforce: "pre",
    async transform(code, id, options) {
      const [filepath, querystring = ""] = id.split("?");

      const [extenesion = ""] =
        querystring.match(fileExtensionRE) ||
        filepath.match(fileExtensionRE) ||
        [];

      if (tsrExtensionRE.test(extenesion)) {
        return {
          code: Failable.runFailure<string, Failable.Success<string>>(
            tsTransform(
              { text: code, filename: id, outputFilename: `${id}.ts`, prependTsCode: true },
              { id: tsrId }
            ),
            Failable.unwrapFailure
          ).value,
        };
      }
    },
  };
}

function generateTsRuntimeFiles(code: string, id = "", options) {
  if (id.endsWith(".tsr")) {
    // call ts.runtime API here to generate TS Runtime object from the source.
    return tsTransform(
      { text: code, filename: id, outputFilename: `${id}.ts`, prependTsCode: true },
      {
        id: tsrId,
      }
    );
  }
}
