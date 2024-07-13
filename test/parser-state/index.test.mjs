/**
 * @module  @kartagia:Getopt/Long/test/parser/state/test
 * 
 * The test suite testing module parser-state operations.
 */

import { expect } from "chai";
import { ArrayParseResult } from "../../src/stateparser.mjs";

describe("function createDefaultStateParser", function() {

});

describe("class ArrayParseState", function() {
    describe("Constructor", function() {
        [
            {
                name: "Default constructor",
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
});

