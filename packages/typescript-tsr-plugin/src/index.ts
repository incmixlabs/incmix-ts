import { Logger } from "./logger";
import { patchModuleLoader } from "./module-loader";
import type ts from "typescript/lib/tsserverlibrary";

function init(modules: { typescript: typeof ts }): ts.server.PluginModule {
  function create(info: ts.server.PluginCreateInfo) {
    const logger = new Logger(info.project.projectService.logger);
    logger.log(
      "Detected that this is not a Tsr project, abort patching TypeScript"
    );

    patchModuleLoader(
      logger,
      {},
      modules.typescript,
      info.languageServiceHost,
      info.project
      //configManager
    );

    const proxy: ts.LanguageService = Object.create(null);

    for (let k of Object.keys(info.languageService) as Array<
      keyof ts.LanguageService
    >) {
      const x = info.languageService[k]!;
      // @ts-expect-error - JS runtime trickery which is tricky to type tersely
      proxy[k] = (...args: Array<{}>) => x.apply(info.languageService, args);
    }

    return proxy;
  }

  function isTsrProject(compilerOptions: ts.CompilerOptions) {
    // Add more checks like "no Tsr file found" or "no config file found"?
    try {
      const isTsrProject =
        typeof compilerOptions.configFilePath !== "string" ||
        require.resolve("svelte", { paths: [compilerOptions.configFilePath] });
      return isTsrProject;
    } catch (e) {
      // If require.resolve fails, we end up here
      return false;
    }
  }

  return { create };
}

export = init;
