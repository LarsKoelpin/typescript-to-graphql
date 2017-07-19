import { GQLType } from './TypescriptParser';

export function buildGql(interfaceName: string, types: GQLType[]): string {
    let lines = '';
    for(let member of types) {
        lines += buildLine(member.identifier, member.type);
    }
    return `type ${interfaceName} {
${lines}
}`;
}

function buildLine(identifier: string, type: string) {
    return `${identifier}: ${type}\n`
}