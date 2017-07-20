export const resultTrans = `type Order {
issuedOn: Int
description: String
age: Int
done: Boolean

}
`;

export  const resultAsm = 
`type Test {
name: String

}
type Gh {
age: Int

}
`

export const resultExample = 
`type ExampleQuery {
name: String
age: Int

}
`;


export const resultInput =
`input ExampleInput {
name: String
age: Int

}
`;

export const resultBoth = 
`type ExampleBoth {
name: String
age: Int

}
input ExampleBoth {
name: String
age: Int

}
`;

export const resultComplex = 
`type Order {
    issuedOn: Int
    target: String

}

type Customer {
    orders: [Order]
    name: String

}
`

export const resultList =
`type Customer {
contacts: [String]

}
`