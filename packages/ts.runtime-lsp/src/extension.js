const vscode = require("vscode");
let { workspace } = require("vscode");
const fs = require("fs");
const path = require("path");
const { transformTypings } = require("@incmix/ts.runtime");
const {
  updateTsConfigWithIncludes,
  generateTypingsFromFiles,
} = require("./utils");

const TYPESCRIPT = "typescript";
const TSR_EXTENSION = ".tsr";
const NODE_MODULES_PATH = "node_modules";
const TSR_FOLDER = ".tsr";
const TYPINGS_FILE_NAME = "index.d.ts";

function activate(context) {
  console.log("Extension 'ts-runtime-lsp' is now active!🎉🎉❤️🚀");

  generateTypingsFromFiles();
  updateTsConfigWithIncludes();

  const onSaveCleaner = workspace.onDidSaveTextDocument(
    async ({ languageId, fileName }) => {
      if (languageId === TYPESCRIPT && fileName.endsWith(TSR_EXTENSION)) {
        try {
          // get the source of the saved file.
          // call ts.runtime API here to generate TS Runtime object from the source.
          // write the generated TS Runtime object to the typings file.
          const filePath = vscode.window.activeTextEditor.document.fileName;
          const fileContent = fs.readFileSync(filePath, "utf8");
          const fileName = path.basename(filePath);
          const fileNameWithoutExtension = fileName.split(".")[0] + ".d.ts";
          const typingsFileContent = transformTypings(
            fileContent,
            fileNameWithoutExtension
          );
          const typingsFilePath = path.join(
            vscode.workspace.rootPath,
            NODE_MODULES_PATH,
            TSR_FOLDER,
            fileNameWithoutExtension
            //TYPINGS_FILE_NAME
          );
          fs.writeFileSync(
            typingsFilePath,
            "declare module '.tsr' { " + typingsFileContent + " }"
          );
        } catch (error) {
          console.log(error);
        }
      }
    }
  );

  const onCloseCleaner = workspace.onDidCloseTextDocument(
    ({ fileName, languageId }) => {
      if (languageId == TYPESCRIPT && fileName.endsWith(TSR_EXTENSION)) {
        onSaveCleaner.dispose();
        onCloseCleaner.dispose();
      }
    }
  );
  context.subscriptions.push(onSaveCleaner);
  context.subscriptions.push(onCloseCleaner);
}

function deactivate() {
  console.log("Extension 'ts-runtime-lsp' is now inactive!😢");
  onSaveCleaner.dispose();
  onCloseCleaner.dispose();
  return undefined;
}

module.exports = {
  activate,
  deactivate,
};
