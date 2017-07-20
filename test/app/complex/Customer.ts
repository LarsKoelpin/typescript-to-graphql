import { GQLQuery } from "ts-interface-to-gql";

interface Customer extends GQLQuery {
    orders: Order[]
    name: String;
}

interface Order extends GQLQuery {
    issuedOn: Date;
    target: string;
}