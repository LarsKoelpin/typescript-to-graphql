# Motivation
This library is targeted to node.js developer, who develop their applications
using the Typescript language and GraphQl.

# Problem
When I develop GraphQl applications, I often feel like I have to synchronize
my TypeScript interfaces to match my graphQl schema or vise versa. This is a tedious task to do,
when changing the schema in development and for me often leads to "any" typings or differences 
between the GQL Schema and the typescript interface. This leads to losing a valuable typescript features or introducing 
avoidable bugs.

This lib helps by translating typescript interfaces directly to graphql schemas, so the 
developer has to maintain only one "source of truth", which are typescript interfaces. 


# The Gist
To use the library, the developer has to extend the GQLQuery or GQLInput or both interface, provided by this package.
The GQLQuery maps 1 to 1 to a GraphQL Query Type, while the GQLInput maps to its GraphQL input counterpart.

The follwing code shows a typescript interface in action.
```typescript
import { GQLQuery } from 'ts-interface-to-gql';

interface ExampleQuery extends GQLQuery {
    name: String;
    age: number;
}
```

This results code may result in the follow schema:
```graphql
type ExampleQuery {
  name: String
  age: Int
}
```

The same takes effect for inputs.
```typescript
import { GQLQuery } from 'ts-interface-to-gql';

interface ExampleInput extends GQLInput {
    name: String;
    age: number;
}
```

which may result in:
```graphql
input ExampleQuery {
  name: String
  age: Int
}
```

Finally, to kickstart the transformer, add it to your typeDefs schema.ts
```typescript
import {
  addMockFunctionsToSchema,
  makeExecutableSchema,
} from 'graphql-tools';

import {resolvers} from './resolvers';
import {transform} from 'ts-interface-to-gql'

let typeDefs = `
# Unspported (by this lib) Typedefs like mutations go in here
`
// this enables interface analysis.
const typeDefs = transform(__dirname) + typeDefs;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };

```


# How does this work
All GQLQuery and GQLInput interfaces get analyzed at startup and translated into a corresponding GQL-Schema. This schema
gets hand over to the underlying graphql-tools schema language parser, which creates the real gql schema.

# Features
* Modelling of simple data types (Sting, Boolean, Integer and Date [as Int] are supported)
* Generating GraphQL Schema (String)
* TypeScript File interface Project Scanning (Only extended interfaces get found!)
* Supports simple inheritage chain
* Support for complex types + Lists 

# TODO (order by my importance)
* Add Support for Query and Mutation
* Add Support for the AS keyword
* Type Name collision detection 
* Generate Graphql Schema directly (to prevent extra String parsing step)
* Add Support for inheritance chains
