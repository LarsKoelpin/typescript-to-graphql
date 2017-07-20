import { GQLQuery } from "ts-interface-to-gql";

interface Order extends GQLQuery {
    issuedOn: Date;
    description?: String;
    age: number;
    done: boolean;
}