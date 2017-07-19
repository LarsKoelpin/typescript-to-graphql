import { GQLInput, GQLQuery } from '../../../../src/transform';

interface ExampleBoth extends GQLQuery, GQLInput {
    name: string;
    age: number;
}