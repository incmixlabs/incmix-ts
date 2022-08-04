import { Plugin } from "vite";

import { transform as tsTransform } from "@incmix/ts.runtime";
import { Failable, id as tsrId } from "@incmix/ts.runtime";

const fileExtensionRE = /\.[^\/\s\?]+$/;
const tsrExtensionRE = /\.tsr\.ts$/;

export function viteTsrPlugin(): Plugin {
  return {
    name: "vite-plugin-tsr",
    enforce: "pre",
    async load(id) {
      console.log({id});
      if (id.endsWith(".tsr.ts")) {
        return {
          code: Failable.runFailure<string, Failable.Success<string>>(
            tsTransform(
              {
                filename: id,
                outputFilename: `${id}.ts`,
                prependTsCode: false,
              },
              { id: tsrId }
            ),
            Failable.unwrapFailure
          ).value,
        };
      }
    },
  };
}
