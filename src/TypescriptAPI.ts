import * as ts from "typescript";

const numberToSyntaxEnum: any[] = [];
for (var n in ts.SyntaxKind) {
  if (typeof ts.SyntaxKind[n] === "number") {
    numberToSyntaxEnum[ts.SyntaxKind[n]] = n;
  }
}

export {numberToSyntaxEnum}