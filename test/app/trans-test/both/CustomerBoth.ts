import { GQLInput, GQLQuery } from "ts-interface-to-gql";

interface ExampleBoth extends GQLQuery, GQLInput {
    name: string;
    age: number;
}