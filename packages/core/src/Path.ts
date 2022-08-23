import path from "path";

class Path {
  path: string;
  filename: string;

  constructor(filename: string, path: string) {
    this.filename = filename;
    this.path = path;
  }

  getFullFilePath() {
    return `${this.path}${path.sep}${this.filename}`;
  }
}

export default Path;
