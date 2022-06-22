export function generateTypingsFromFiles() {
  // loop through all files in the workspace and get all files that end with .tsr
  // then generate typings for each of those files
  const files = getAllFilesInWorkspace();
  files.forEach((file) => {
    if (file.endsWith(TSR_EXTENSION)) {
      generateTypings(file);
    }
  });
}

export function getAllFilesInWorkspace() {
  const files = [];
  const workspaceFolders = workspace.workspaceFolders;
  try {
    if (workspaceFolders) {
      workspaceFolders.forEach((folder) => {
        if (!folder.uri.fsPath.includes(NODE_MODULES_PATH)) {
          const filesInFolder = getAllFilesInFolder(folder.uri.fsPath);
          files.push(...filesInFolder);
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
  return files;
}

export function getAllFilesInFolder(folderPath) {
  const files = [];
  try {
    const filesInFolder = fs.readdirSync(folderPath);
    filesInFolder.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const fileStats = fs.statSync(filePath);
      if (fileStats.isDirectory() && !file.includes(NODE_MODULES_PATH)) {
        const filesInSubFolder = getAllFilesInFolder(filePath);
        files.push(...filesInSubFolder);
      } else {
        if (file.endsWith(TSR_EXTENSION)) {
          files.push(filePath);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
  return files;
}

export async function generateTypings(filePath) {
  const PATH_TO_TSR_FOLDER = path.join(
    vscode.workspace.rootPath,
    NODE_MODULES_PATH,
    TSR_FOLDER
  );

  // check if the folder exists
  if (!fs.existsSync(PATH_TO_TSR_FOLDER)) {
    fs.mkdirSync(PATH_TO_TSR_FOLDER);
  }

  const fileName = path.basename(filePath);
  const fileNameWithoutExtension = fileName.split(".")[0] + ".d.ts";
  const typingsFilePath = path.join(
    vscode.workspace.rootPath,
    NODE_MODULES_PATH,
    TSR_FOLDER,
    fileNameWithoutExtension
    //TYPINGS_FILE_NAME
  );

  const typingsFileContent = generateTypingsFileContent(filePath);
  try {
    fs.writeFileSync(
      typingsFilePath,
      "declare module '.tsr' { " + typingsFileContent + " }",
      {
        flag: "as+",
      }
    );
  } catch (error) {
    console.error(error);
  }
}

export function generateTypingsFileContent(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const fileName = path.basename(filePath);
  const fileNameWithoutExtension = fileName.split(".")[0];
  const typingsFileContent = transformTypings(
    fileContent,
    fileNameWithoutExtension
  );
  return typingsFileContent;
}

export function updateTsConfigWithIncludes() {
  const tsConfigPath = path.join(vscode.workspace.rootPath, "tsconfig.json");
  const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, "utf8"));
  const INCL_PATH = NODE_MODULES_PATH + "/" + TSR_EXTENSION + "/**/*";
  if (tsConfig.include) {
    if (!tsConfig.include.includes(INCL_PATH)) {
      tsConfig.include.push(INCL_PATH);
    }
  } else {
    tsConfig.include = [INCL_PATH];
  }
  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
}
