import { GQLInput } from "ts-interface-to-gql";

interface ExampleInput extends GQLInput {
    name: string;
    age: number;
}
