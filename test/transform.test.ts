import 'ts-jest';

import {config, findFiles, parse, transform} from '../src/transform';
import { resultAsm, resultBoth, resultComplex, resultExample, resultInput, resultList, resultTrans } from './results';

config.logging = false;

describe('File Analyizing', () => {
   it('Shall find all ts-files', () => {
       console.log(findFiles(__dirname + "/app"));
       expect(findFiles(__dirname + "/app/asm-test")).toHaveLength(2);
   });
})

describe('Transformation', () => {
    it("Transforms Order to graphql type", () => {
        expect(transform(__dirname + "/app/sub")).toBe(resultTrans);
    });

    it('Assembles all types', () => {
        expect(transform(__dirname + "/app/asm-test")).toBe(resultAsm);
    });

    it("transforms GQLQuery interfaces", () => {
        expect(transform(__dirname + "/app/trans-test/query")).toBe(resultExample);
    });
    
    it("transforms GQLInput interfaces", () => {
        expect(transform(__dirname + "/app/trans-test/input")).toBe(resultInput);
    });

    it("transforms GQLInput and GQLQuery interfaces", () => {
        expect(transform(__dirname + "/app/trans-test/both")).toBe(resultBoth);
    });

    it("models list types correctly", () => {
       expect(transform(__dirname + "/app/list")).toBe(resultList);
    });

    it('models custom types correctly', () => {
        expect(transform(__dirname + "/app/complex")).toBe(resultComplex);
    });
});
