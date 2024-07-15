/**
 * @module  @kartagia:Getopt/Long/test/parser/state/test
 * 
 * The test suite testing module parser-state operations.
 */

import { expect } from "chai";
import { ArrayParseResult } from "../../src/stateparser.mjs";

describe("function createDefaultStateParser", function () {

});


describe("class ArrayParseResult", function () {

    const defaultConstructionParams = [
        ["With undefined props", undefined],
        ["With empty props", {}],
        ["With start index 5", { startIndex: 5 }],
        ["With error index 5", { endIndex: 5 }],
        ["With end index 5", { errorIndex: 5 }],
        ["With start index 3, error index 5, and current idnex 8", { startIndex: 3, errorIndex: 5, currentIndex: 8 }]
    ];

    describe("Constructor", function () {
        [
            {
                name: "Default constructor with undefined props",
                params: undefined,
                test: (value) => {
                    expect(value).instanceof(ArrayParseResult);
                    [["startIndex"], 0, ["currentIndex", 0],
                    ["createNewResult", false], ["isEnd", false],
                    ["isError", false]].forEach(
                        ([prop, expectedValue = undefined]) => {
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
                    [["startIndex"], 0, ["currentIndex", 0],
                    ["createNewResult", false], ["isEnd", false],
                    ["isError", false]].forEach(
                        ([prop, expectedValue = undefined]) => {
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
                params: { startIndex: 5 },
                test: (value) => {
                    expect(value).instanceof(ArrayParseResult);
                    [["startIndex"], 5, ["currentIndex", 5],
                    ["createNewResult", false], ["isEnd", false],
                    ["isError", false]].forEach(
                        ([prop, expectedValue = undefined]) => {
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
                params: { errorIndex: 5 },
                test: (value) => {
                    expect(value).instanceof(ArrayParseResult);
                    [["startIndex"], 0, ["currentIndex", 0],
                    ["errorIndex", 5],
                    ["createNewResult", false], ["isEnd", false],
                    ["isError", true]].forEach(
                        ([prop, expectedValue = undefined]) => {
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
                params: { endIndex: 5 },
                test: (value) => {
                    expect(value).instanceof(ArrayParseResult);
                    [["startIndex"], 0, ["currentIndex", 0],
                    ["endIndex", 5],
                    ["createNewResult", false], ["isEnd", true],
                    ["isError", false]].forEach(
                        ([prop, expectedValue = undefined]) => {
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
                params: { errorIndex: 5, startIndex: 3, currentIndex: 8 },
                test: (value) => {
                    expect(value).instanceof(ArrayParseResult);
                    [["startIndex"], 3, ["currentIndex", 8],
                    ["errorIndex", 5],
                    ["createNewResult", false], ["isEnd", false],
                    ["isError", true]].forEach(
                        ([prop, expectedValue = undefined]) => {
                            expect(value).have(prop);
                            if (expectedValue !== undefined) {
                                expect(value).property(prop, expectedValue);
                            }
                        }
                    )
                }
            }


        ].forEach(testCase => {
            it(testCase.name, function () {
                let result = undefined;
                expect(() => {
                    result = new ArrayParseResult(testCase.params)
                }).not.throw();

            });
        });
    })

    describe("setCurrent", function () {

        /**
         * Get the current index.
         * @param {import("../../src/stateparser.mjs").ArrayParseResultParams} [params] 
         * @returns {number} The current index of the parameters.
         */
        function getCurrentIndex(params) {
            if (params) {
                if (params.currentIndex) {
                    return params.currentIndex;
                } else if (params.startIndex) {
                    return params.startIndex;
                }
            }
            return 0;
        }

        defaultConstructionParams.map(([name, params]) => ({
            name: `${name} setting current index to ${getCurrentIndex(params) + 1}`,
            target: new ArrayParseResult(params),
            params: getCurrentIndex(params) + 1,
            test(value) {
                expect(value.currentIndex).equal(getCurrentIndex(params) + 1);
            }
        })).forEach((testCase) => {
            it(`${testCase.name}`, function () {
                let result;
                if (testCase.exception) {
                    expect(() => { result = testCase.target.setCurrent(testCase.params) }).to.throw(testCase.exception);
                } else {
                    expect(() => { result = testCase.target.setCurrent(testCase.params) }).to.not.throw();
                    testCase.test(result);
                }
            })
        });
    });

    describe("setError", function () {

        /**
         * Get the current index.
         * @param {import("../../src/stateparser.mjs").ArrayParseResultParams} [params] 
         * @returns {number} The current index of the parameters.
         */
        function getNewErrorIndex(params) {
            return (params?.errorIndex ? params.errorIndex + 1 : 0);
        }


        defaultConstructionParams.map(([name, params]) => ({
            name: `${name} setting error index to ${getNewErrorIndex(params)}`,
            target: new ArrayParseResult(params),
            params: getNewErrorIndex(params),
            test(value) {
                const expectedIndex = getNewErrorIndex(params);
                if (expectedIndex === undefined) {
                    expect(value.errorIndex).undefined;
                } else {
                    expect(value.errorIndex).equal(getNewErrorIndex(params));
                }
            }
        })).forEach((testCase) => {
            it(`${testCase.name}`, function () {
                let result;
                if (testCase.exception) {
                    expect(() => { result = testCase.target.setError(testCase.params) }).to.throw(testCase.exception);
                } else {
                    expect(() => { result = testCase.target.setError(testCase.params) }).to.not.throw();
                    testCase.test(result);
                }
            })
        });
    });

    describe("setEnd", function () {

        /**
         * Get the current index.
         * @param {import("../../src/stateparser.mjs").ArrayParseResultParams} [params] 
         * @returns {number} The current index of the parameters.
         */
        function getNewEndIndex(params) {
            return (params?.endIndex ? params.endIndex + 1 : 0);
        }


        defaultConstructionParams.map(([name, params]) => ({
            name: `${name} setting end index to ${getNewEndIndex(params)}`,
            target: new ArrayParseResult(params),
            params: getNewEndIndex(params),
            test(value) {
                const expectedIndex = getNewEndIndex(params);
                if (expectedIndex === undefined) {
                    expect(value.endIndex).undefined;
                } else {
                    expect(value.endIndex).equal(getNewEndIndex(params));
                }
            }
        })).forEach((testCase) => {
            it(`${testCase.name}`, function () {
                let result;
                if (testCase.exception) {
                    expect(() => { result = testCase.target.setEnd(testCase.params) }).to.throw(testCase.exception);
                } else {
                    expect(() => { result = testCase.target.setEnd(testCase.params) }).to.not.throw();
                    testCase.test(result);
                }
            })
        });
    });

    describe("setStart", function () {

        /**
         * Get the current index.
         * @param {import("../../src/stateparser.mjs").ArrayParseResultParams} [params] 
         * @returns {number} The current index of the parameters.
         */
        function getNewStartIndex(params) {
            return ((params?.startIndex) ?? 0) + 1;
        }


        defaultConstructionParams.map(([name, params]) => ({
            name: `${name} setting start index to ${getNewStartIndex(params)}`,
            target: new ArrayParseResult(params),
            params: getNewStartIndex(params),
            test(value) {
                const expectedIndex = getNewStartIndex(params);
                if (expectedIndex === undefined) {
                    expect(value.startIndex).undefined;
                } else {
                    expect(value.startIndex).equal(getNewStartIndex(params));
                }
            }
        })).forEach((testCase) => {
            it(`${testCase.name}`, function () {
                let result;
                if (testCase.exception) {
                    expect(() => { result = testCase.target.setStart(testCase.params) }).to.throw(testCase.exception);
                } else {
                    expect(() => { result = testCase.target.setStart(testCase.params) }).to.not.throw();
                    testCase.test(result);
                }
            })
        });
    });


    /**
     * The tested new results.
     * @type {(undefined|number[])}
     */
    const testedResults = [undefined, [3, 5], [3, 5, 8]];

    describe("Test setResult", function () {

        defaultConstructionParams.forEach(([name, constructorParams]) => {

            /**
             * @type {ArrayParseResult<number>}
             */
            const originalParseResult = /** @type {ArrayParseResult<number, number[]>} */ new ArrayParseResult(constructorParams);

            // Taking old result for testing old result is respected.
            let tested = originalParseResult.setResult(originalParseResult.result);

            /**
             * Test whether the tested follows the create new result.
             * @param {ArrayParseResult<number>} tested The tested result.
             * @param {ArrayParseResult<number>} oldParseResult The previous result from which the old result is generated.
             */
            function testCreateNewResult(tested, oldParseResult) {
                expect(oldParseResult).a("object");
                if (oldParseResult.createNewResult) {
                    expect(tested, "The create new result not respeected").not.equal(oldParseResult);
                } else {
                    expect(tested, "The create new result not respected - result is not equal to result.").equal(oldParseResult);
                }
            }

            describe(`ArrayStateParser ${name}`, function () {
                it("Constructed object ${name}: Does the setResult respect create new result", function () {
                    testCreateNewResult(tested, originalParseResult);
                });


                // Creating the test cases.
                testedResults.map(newResult => {
                    /**
                     * The expected result of the 
                     */
                    const expectedNewResult = newResult ? [...newResult] : [];
                    return {
                        name: `Set result to ${newResult} for ${name}`,
                        tested,
                        params: newResult,
                        /**
                         * Test the result of hte setResult.
                         * @param {ArrayTestCase<number>} value 
                         */
                        test(value) {
                            testCreateNewResult(value, tested);
                            if (expectedResult === undefined) {
                                expect(value.result, `The result was not set to undefined`).undefined;
                            } else {
                                expect(value.result, `The result was not the expected array [${expectedNewResult.map(entry => String(entry)).join(",")}]`).eql(expectednewResult)
                            }
                        }
                    }
                }).forEach(testCase => {
                    it(testCase.name, function () {
                        /**
                         * @type {ArrayParseResult<number, number[]>}
                         */
                        if (testCase.expectedException) {
                            let result;
                            expect(() => { result = testCase.tested.setResult(testCase.params) }, "Test did not throw expected exception").to.throw(testCase.expectedException);
                        } else {
                            expect(() => {
                                const testedValue = testCase.tested.setResult(testCase.params);
                                console.log(`Parse result returned ${testedValue}`);
                                testCase.test(testedValue);
                            }, "Test did throw unexpected exception.").not.throw;
                        }
                    });



                })
            })
        })
    });

    describe.skip("Test addResult", function () {
        defaultConstructionParams.flatMap(([name, constructorParams]) => {

            const tested = new ArrayParseResult(constructorParams);
            return testedResults.map(newResult => {
                if (tested.createNewResult) {
                    let expectedResult = newResult;
                    return {
                        name: `Set result to ${newResult} for ${name}`,
                        tested,
                        params: newResult,
                        expectedResult,
                        test(value) {
                            expect(value).not.equal(tested);
                            if (newParams === undefined) {
                                expect(value).undefined;
                            } else {
                                expect(value).eql(newResult)
                            }
                        }
                    };

                } else {
                    let expectedResult = newResult;
                    return {
                        name: `Set result to ${newResult} for ${name}`,
                        tested,
                        params: newResult,
                        expectedResult,
                        test(value) {
                            expect(value).equal(tested);
                            if (newParams === undefined) {
                                expect(value).property("result", undefined);
                            } else {
                                expect(value.result).eql(newResult)
                            }
                        }
                    };
                };

            })
        }).forEach(testCase => {
            it(testCase.name, function () {
                let result;
                if (testCase.expectedException) {
                    expect(() => { result = testCase.tested.setResult(testCase.params) }).to.throw(testCase.expectedException);
                } else {
                    expect(() => { result = testCase.tested.setResult(testCase.params) }).not.throw;
                    testCase.test(result);
                }
            });

        })

    });


});




