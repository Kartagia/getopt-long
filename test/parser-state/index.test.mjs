/**
 * @module  @kartagia:Getopt/Long/test/parser/state/test
 * 
 * The test suite testing module parser-state operations.
 */

import { expect } from "chai";
import { ArrayParseResult } from "../../src/stateparser.mjs";

describe("function createDefaultStateParser", function() {

});


describe("class ArrayParseResult", function() {

    const defaultConstructionParams = [
        ["With undefined props", undefined],
        ["With empty props", {}],
        ["With start index 5", {startIndex: 5}],
        ["With error index 5",{endIndex: 5}],
        ["With end index 5",{errorIndex: 5}], 
        ["With start index 3, error index 5, and current idnex 8",{startIndex: 3, errorIndex: 5, currentIndex: 8}]
    ];

    describe("Constructor", function() {
        [
            {
                name: "Default constructor with undefined props",
                params: undefined,
                test: (value) => {
                    expect(value).instanceof(ArrayParseResult);
                    [ ["startIndex"], 0, ["currentIndex", 0], 
                ["createNewResult", false], ["isEnd", false], 
            ["isError", false] ].forEach(
                        ([prop, expectedValue=undefined]) => {
                            expect(value).have(prop);
                            if (expectedValue !== undefined) {
                                expect(value).property(prop, expectedValue);
                            }
                        }
                    )
                }
            },
            {
                name: "Default constructor with empty props",
                params: {},
                test: (value) => {
                    expect(value).instanceof(ArrayParseResult);
                    [ ["startIndex"], 0, ["currentIndex", 0], 
                ["createNewResult", false], ["isEnd", false], 
            ["isError", false] ].forEach(
                        ([prop, expectedValue=undefined]) => {
                            expect(value).have(prop);
                            if (expectedValue !== undefined) {
                                expect(value).property(prop, expectedValue);
                            }
                        }
                    )
                }
            },
            {
                name: "Constructor with start index 5",
                params: {startIndex: 5},
                test: (value) => {
                    expect(value).instanceof(ArrayParseResult);
                    [ ["startIndex"], 5, ["currentIndex", 5], 
                ["createNewResult", false], ["isEnd", false], 
            ["isError", false] ].forEach(
                        ([prop, expectedValue=undefined]) => {
                            expect(value).have(prop);
                            if (expectedValue !== undefined) {
                                expect(value).property(prop, expectedValue);
                            }
                        }
                    )
                }
            },
            {
                name: "Constructor with error index 5",
                params: {errorIndex: 5},
                test: (value) => {
                    expect(value).instanceof(ArrayParseResult);
                    [ ["startIndex"], 0, ["currentIndex", 0], 
                    ["errorIndex", 5],
                ["createNewResult", false], ["isEnd", false], 
            ["isError", true] ].forEach(
                        ([prop, expectedValue=undefined]) => {
                            expect(value).have(prop);
                            if (expectedValue !== undefined) {
                                expect(value).property(prop, expectedValue);
                            }
                        }
                    )
                }
            },
            {
                name: "Constructor with end index 5",
                params: {endIndex: 5},
                test: (value) => {
                    expect(value).instanceof(ArrayParseResult);
                    [ ["startIndex"], 0, ["currentIndex", 0], 
                    ["endIndex", 5],
                ["createNewResult", false], ["isEnd", true], 
            ["isError", false] ].forEach(
                        ([prop, expectedValue=undefined]) => {
                            expect(value).have(prop);
                            if (expectedValue !== undefined) {
                                expect(value).property(prop, expectedValue);
                            }
                        }
                    )
                }
            },
            {
                name: "Constructor with error index 5, start index 3 and current index 8",
                params: {errorIndex: 5, startIndex: 3, currentIndex: 8},
                test: (value) => {
                    expect(value).instanceof(ArrayParseResult);
                    [ ["startIndex"], 3, ["currentIndex", 8], 
                    ["errorIndex", 5],
                ["createNewResult", false], ["isEnd", false], 
            ["isError", true] ].forEach(
                        ([prop, expectedValue=undefined]) => {
                            expect(value).have(prop);
                            if (expectedValue !== undefined) {
                                expect(value).property(prop, expectedValue);
                            }
                        }
                    )
                }
            }


        ].forEach( testCase => {
            it(testCase.name, function() {
                let result = undefined;
                expect( () => {
                    result = new ArrayParseResult(testCase.params)
                }).not.throw();
                
            });
        });
    })

    describe("setCurrent", function () {
        defaultConstructionParams.map( ([name, params]) => ({
            name,
            target: new ArrayParseResult(params),
            params: 5,
            test(value) {
                expect(value.currentIndex).equal(5);
            }
        })).forEach( (testCase) => {
            let result;
            if (testCase.exception){
                expect( () => {result = testCase.target.setCurrent(testCase.params)}).to.throw(testCase.exception);
            } else {
                expect( () => {result = testCase.target.setCurrent(testCase.params)}).to.not.throw();
                testCase.test(result);
            }
        });
    });

});

