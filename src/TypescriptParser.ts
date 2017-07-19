import * as ts from "typescript";

import { buildGqlInput, buildGqlQuery } from "./GQLBuilder";

import { log } from "./TransformLogger";

const queryInterface = "GQLQuery";
const inputInterface = "GQLInput";

export interface GQLType {
  identifier: string;
  type: string;
}

const tsToGraphqlType = {
  String: "String",
  string: "String",
  number: "Int",
  Date: "Int",
  boolean: "Boolean"
};

export function parse(sourceFile: ts.SourceFile, node: ts.Node): string {
  const declaration = node as ts.Declaration;
  let resultingSchema = "";
  if (declaration.kind === ts.SyntaxKind.InterfaceDeclaration) {
    let interfaceName = (declaration as ts.InterfaceDeclaration).name.getText();
    const members: GQLType[] = [];
    log("Found interface: ", interfaceName);
    const typeScriptInterface = declaration as ts.InterfaceDeclaration;

    let isQuery = false;
    let isInput = false;
    if (typeScriptInterface.heritageClauses) {
      typeScriptInterface.heritageClauses.forEach(heritage => {
        heritage.types.forEach(ttype => {
          if (ttype.kind === ts.SyntaxKind.ExpressionWithTypeArguments) {
            log(interfaceName, "inherits from ", (ttype as any).getText());
            if ((ttype as any).getText() === queryInterface) {
              isQuery = true;
            }

            if ((ttype as any).getText() === inputInterface) {
              isInput = true;
            }
          }
        });
      });
    }

    if (isQuery || isInput) {
      typeScriptInterface.members.forEach(member => {
        if (member.kind === ts.SyntaxKind.PropertySignature) {
          const memberName = (member as any).name.getText();
          let typeText;
          if (isType(member, ts.SyntaxKind.NumberKeyword)) {
            typeText = "number";
          } else if (isType(member, ts.SyntaxKind.BooleanKeyword)) {
            typeText = "boolean";
          } else if (isType(member, ts.SyntaxKind.StringKeyword)) {
            typeText = "String";
          } else {
            log((member as any).type.kind);
            typeText = (member as any).type.typeName.text; // String, Date Number...
          }
          members.push({
            identifier: memberName,
            type: tsToGraphqlType[typeText]
          });
        }
      });
      if (isQuery) {
        resultingSchema += buildGqlQuery(interfaceName, members);
      }
      if (isInput) {
        resultingSchema += buildGqlInput(interfaceName, members);
      }
    } else {
      log(interfaceName, " is not relevant");
    }
  } else if (declaration.kind === ts.SyntaxKind.ClassDeclaration) {
    // Do Nothin with classes
  }
  return resultingSchema;
}

const isType = (member: any, kind: ts.SyntaxKind) =>
  (member as any).type.kind === kind;
