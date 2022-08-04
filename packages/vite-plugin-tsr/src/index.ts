import {Plugin} from "vite";

import {transform as tsTransform} from "@incmix/ts.runtime";
import {Failable, id as tsrId} from "@incmix/ts.runtime";

const fileExtensionRE = /\.[^\/\s\?]+$/;
const tsrExtensionRE = /\.tsr\.ts$/;

export function viteTsrPlugin(): Plugin {
    return {
        name: "vite-plugin-tsr",
        enforce: "pre",
        async transform(id, options) {
            const [filepath, querystring = ""] = id.split("?");

            const [extenesion = ""] =
                querystring.match(fileExtensionRE) ||
                filepath.match(fileExtensionRE) ||
                [];

            if (tsrExtensionRE.test(extenesion)) {
                return {
                    code: Failable.runFailure<string, Failable.Success<string>>(
                        tsTransform(
                            {filename: id, outputFilename: `${id}.ts`, prependTsCode: false},
                            {id: tsrId}
                        ),
                        Failable.unwrapFailure
                    ).value,
                };
            }
        },
    };
}

function generateTsRuntimeFiles(id = "", options) {
    if (id.endsWith(".tsr")) {
        // call ts.runtime API here to generate TS Runtime object from the source.
        return tsTransform(
            {filename: id, outputFilename: `${id}.ts`, prependTsCode: false},
            {
                id: tsrId,
            }
        );
    }
}
