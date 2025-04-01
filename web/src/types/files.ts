export interface FileContents {
  contents: string;
}

export interface DirectoryContents {
  [key: string]: FileNode;
}

export interface FileNode {
  file?: FileContents;
  directory?: DirectoryContents;
  contents?: string;
}

export interface DirectoryNode {
  [key: string]: FileNode;
}
