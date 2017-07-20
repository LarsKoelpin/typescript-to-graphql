import { GQLQuery } from "ts-interface-to-gql";

interface ExampleQuery extends GQLQuery {
    name: String;
    age: number;
}