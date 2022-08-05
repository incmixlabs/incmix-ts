import path from "path";

export type Path = {path: string, filename: string};

export const wrap = (filename: string, path: string) => {
    return {path, filename} as Path;
};

export const getFullFilePath = (wrappedPath: Path) =>
    `${wrappedPath.path}${path.sep}${wrappedPath.filename}`;