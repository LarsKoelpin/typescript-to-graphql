import * as ts from "typescript";

import { buildGqlInput, buildGqlQuery } from "./GQLBuilder";

import { log } from "./TransformLogger";

const queryInterface = "GQLQuery";
const inputInterface = "GQLInput";

export interface GQLType {
  identifier: string;
  type: string;
}

const customTypeMapping = {
  "Date": "Int",
  "String": "String",
  "Boolean": "Boolean",
  "ID": "String"
};

interface CreatedInterface {
  interfaceName: string;
  dependencies: string[]; // interface names
}
const createdInterfaces: CreatedInterface[] = [];

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
      let dependencies: string[] = [];
      typeScriptInterface.members.forEach(member => {
        if (member.kind === ts.SyntaxKind.PropertySignature) {
          const memberName = (member as any).name.getText();
          const memberAsAny = (member as any);
          let typeText;
          let isTsArray = false;
          if (isType(member, ts.SyntaxKind.NumberKeyword)
             || isType(member, ts.SyntaxKind.BooleanKeyword
             || isType(member, ts.SyntaxKind.StringKeyword))) {
            typeText = tsSyntaxToGraphQL(memberAsAny.type.kind);
            if(typeText === null) {
              const customType = (member as any).type.typeName.text;
              typeText = mapCustomType(customType);
            }
          } else if(isType(member, ts.SyntaxKind.ArrayType)) {
            const elemKind = memberAsAny.type.elementType.kind;
            if(isBuiltIn(elemKind)) {
              // Map TS ENUM to GRAPHQL String
              typeText = `[${tsSyntaxToGraphQL(elemKind)}]`;
              isTsArray = true;
            } else {
              const arrayType = memberAsAny.type.elementType.typeName.getText();
              typeText = `[${arrayType}]`;
              dependencies.push(arrayType);
            }
          } else {
            typeText = tsSyntaxToGraphQL(memberAsAny.type.kind); // String, Date Number...
            if(typeText === null) {
              const customType = (member as any).type.typeName.text;
              typeText = mapCustomType(customType);
            }
          }
          log("member ", memberName, " TYPE: ", typeText)
          members.push({
            identifier: memberName,
            type: typeText
          });
        }
      });
      if (isQuery) {
        resultingSchema += buildGqlQuery(interfaceName, members);
      }
      if (isInput) {
        resultingSchema += buildGqlInput(interfaceName, members);
      }
      log("Adding new Custom Type", interfaceName);
      log("Created Custom Type ", interfaceName, " has dependencies to ", dependencies);
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

const isBuiltIn = (type: any) => 
type == ts.SyntaxKind.StringKeyword ||
type == ts.SyntaxKind.NumberKeyword ||
type == ts.SyntaxKind.BooleanKeyword 

const tsSyntaxToGraphQL = (type) => {
  switch(type) {
    case ts.SyntaxKind.StringKeyword: return 'String';
    case ts.SyntaxKind.BooleanKeyword: return 'Boolean';
    case ts.SyntaxKind.NumberKeyword: return 'Int';
    default: return null;
  }
}

const mapCustomType = (typeName: String): string => {
  const result = customTypeMapping[typeName.toString()];
  if(!result) {
    throw new Error("Unknown custom type " + typeName.toString());
  }
  return result;
}

const createDependency = () => {
  
}