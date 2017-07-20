import { GQLQuery } from "ts-interface-to-gql";

export interface Customer extends GQLQuery {
  age: number;
}