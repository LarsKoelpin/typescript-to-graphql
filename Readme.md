# Motivation
This library is targeted to node.js developer, who develop their applications
using typescript and graphql

# Problem
When I develop graphQl Applications, I often feel like I have to synchronize
my TypeScript Interfaces with my graphQl Schema. This is a tedious task to do,
when changing the schema and for me often leads to "any" typing because of that, 
loosing a valuable typescript feature.

This lib helps by translating typescript interfaces to graphql interfaces, so the 
developer has to maintain only one "source of truth", which are typescript interfaces. 


# The Gist
To use the library, the developer has to extend the GQLQuery or GQLInput or both interface, provided by this package.

```typescript
import { GQLQuery } from 'ts-interface-to-gql';

interface ExampleQuery extends GQLQuery {
    name: String;
    age: number;
}
```

This results e.g. in the follow schema
```graphql
type ExampleQuery {
  name: String
  age: Int
}
```

# How does this work
All GQLQuery and GQLInput interfaces get analyzed at startup and translated into a GQL-Schema. This schema
gets hand over to the underlying graphql (e.g. express-graphl) library, which creates the schema.

# Features
* Modelling of simple data types (Sting, Boolean, Integer and Date [as Int] are supported)
* Generating GraphQL Schema (String)
* TypeScript File interface Project Scanning (Only extended interfaces get found!)
* Supports simple inheritage chain

# TODO
* Add Supprt for the AS keyword
* Add support for complex types
* Generate Graphql Schema directly (to prevent extra String parsing step)
* Add Support for inheritance chains