import 'ts-jest';

import {findFiles, parse, transform} from '../src/transform';

interface Customer {
    name: String;
}

describe('File Analyizing', () => {
   it('Shall find all ts-files', () => {
       console.log(findFiles(__dirname + "/app"));
       expect(findFiles(__dirname + "/app")).toHaveLength(2);
   });
})

describe('Transformation', () => {
    it("transforms Customer to graphql type", () => {
        const result = `
type Order {
issuedOn: Int
description: String
age: Int
done: Boolean

}
`.trim();
        expect(transform(__dirname + "/app/sub")).toBe(result);
    });

    it("transforms GQLInterfaces only", () => {

    });

    // types erknennen => types modellieren "Custom types mappen"
    it('models custom types correctly', () => {

    })
});
