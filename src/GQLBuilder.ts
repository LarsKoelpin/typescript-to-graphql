import { GQLType } from './TypescriptParser';

export function buildGqlQuery(interfaceName: string, types: GQLType[]): string {
    let lines = '';
    for(let member of types) {
        lines += buildLine(member.identifier, member.type);
    }
    return `type ${interfaceName} {
${lines}
}
`;
}

export function buildGqlInput(interfaceName: string, types: GQLType[]): string {
    let lines = '';
    for(let member of types) {
        lines += buildLine(member.identifier, member.type);
    }
    return `input ${interfaceName} {
${lines}
}
`;
}

function buildLine(identifier: string, type: string) {
    return `${identifier}: ${type}\n`
}

