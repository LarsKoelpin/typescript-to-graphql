import { GQLQuery } from "ts-interface-to-gql";

interface Customer extends GQLQuery{
    contacts: string[];
}