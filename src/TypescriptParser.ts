import * as ts from 'typescript';

import { buildGql } from './GQLBuilder';

export interface GQLType {
    identifier: string,
    type: string
}

const tsToGraphqlType = {
   "String": "String",
   "string": "String",
   "number": "Int",
   "Date": "Int",
   "boolean": "Boolean"
}

export function parse(sourceFile: ts.SourceFile, node: ts.Node): string {
  const declaration = node as ts.Declaration;
  let resultingSchema = '';
  if (declaration.kind === ts.SyntaxKind.InterfaceDeclaration) {
    let interfaceName = (declaration as ts.InterfaceDeclaration).name.getText();
    const members: GQLType[]  = [];
    console.log("Found interface: ", interfaceName);
    const typeScriptInterface = declaration as ts.InterfaceDeclaration;
    
    if (typeScriptInterface.heritageClauses) {
      typeScriptInterface.heritageClauses.forEach(heritage => {
        heritage.types.forEach(ttype => {
          if (ttype.kind === ts.SyntaxKind.ExpressionWithTypeArguments) {
            console.log(
              interfaceName,
              "inherits from ",
              (ttype as any).getText()
            );
          }
        });
      });
    }
    
    typeScriptInterface.members.forEach(member => {
      if (member.kind === ts.SyntaxKind.PropertySignature) {
        const memberName = (member as any).name.getText();
        let typeText;
        if (isType(member, ts.SyntaxKind.NumberKeyword)) {
          typeText = "number";
        } else if (isType(member, ts.SyntaxKind.BooleanKeyword)) {
          typeText = "boolean";
        } else if(isType(member, ts.SyntaxKind.StringKeyword)) {
          typeText = "String";
        } else {
          console.log((member as any).type.kind);
          typeText = (member as any).type.typeName.text; // String, Date Number...
        }
        members.push({
          identifier: memberName,
          type: tsToGraphqlType[typeText]
        });
      }
    });
    resultingSchema += buildGql(interfaceName, members);
  } else if (declaration.kind === ts.SyntaxKind.ClassDeclaration) {
    // Do Nothin with classes
  }
  return resultingSchema;
}

const isType = (member: any, kind: ts.SyntaxKind) => (member as any).type.kind === kind