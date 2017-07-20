declare module 'ts-interface-to-gql' {
    export function transform(filePath: string);
    export const config: {logging: boolean};
    export interface GQLQuery {}
    export interface GQLInput {}
}
