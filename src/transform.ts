import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as ts from "typescript";

import {parse} from './TypescriptParser';

export function findFiles(filePath: string) {
    console.log("Searching in path ", filePath);
    const fileNames = glob.sync(path.join(filePath, "{,!(node_modules)/**/}*.ts"), {ignore: '/node_modules/', nodir: true});
    return fileNames;
}

function transform(filePath: string) {
  const compilerOptions: ts.CompilerOptions = {};
  const fileNames = findFiles(filePath);
  const program = ts.createProgram(fileNames, compilerOptions);
  const typeChecker = program.getTypeChecker();
  const sourceFiles = program.getSourceFiles();

  console.log("Found SoureceFiles", fileNames);
  console.log("Starting generation an", program.getCurrentDirectory())
  let schemas = '';

  sourceFiles.filter(f => f.fileName.indexOf('node_modules') === -1).forEach(sourceFile => {
      ts.forEachChild(sourceFile, node => {
          schemas += parse(sourceFile, node);
          console.log(schemas);
    });
  });
  return schemas;
}

export default transform;
export {parse};
export {transform};