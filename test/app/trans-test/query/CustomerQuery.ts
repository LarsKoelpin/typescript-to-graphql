import { GQLQuery } from '../../../../src/transform';

interface ExampleQuery extends GQLQuery {
    name: String;
    age: number;
}