import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { DirectoryNode, FileNode } from '@/types/files';

export const createProjectZip = async (files: DirectoryNode) => {
  const zip = new JSZip();

  const addToZip = (node: FileNode, path: string = '') => {
    if (node.file) {
      // Add file to zip
      zip.file(path, node.file.contents);
    } else if (node.directory) {
      // Recursively add directory contents
      Object.entries(node.directory).forEach(([name, childNode]) => {
        const newPath = path ? `${path}/${name}` : name;
        addToZip(childNode, newPath);
      });
    }
  };

  // Process all root level entries
  Object.entries(files).forEach(([name, node]) => {
    addToZip(node, name);
  });

  // Generate the zip file
  const content = await zip.generateAsync({ type: 'blob' });
  
  // Save the file
  saveAs(content, 'curie-project.zip');
};
