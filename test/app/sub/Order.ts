import { GQLQuery } from '../../../src/transform';
interface Order extends GQLQuery {
    issuedOn: Date;
    description?: String;
    age: number;
    done: boolean;
}