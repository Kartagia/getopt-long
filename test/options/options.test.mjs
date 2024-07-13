
import { expect } from "chai";
import {CommandLineOption, OptionBuilder} from "../../src/options.mjs";

/**
 * Testing module for options.
 */

describe("Options builder", function() {

    const defaultOptionDefinitionTests = {
        optionName: (value) => {
            expect(value).a("string");
        },
        options: (value) => {
            expect(value).a("object");
            expect(value.switchNameIsAlias).false;
            expect(value.requireValue).false;
            expect(value.multivValued).false;
        }
    };

    describe("Consruction", function() {
        [
            {
                name: "Empty construction",
                params: ["Test", {}],
                test(value) {
                    expect(value).instanceof(OptionBuilder);
                    expect(value).property("required", false);
                }
            }
        ].forEach( (testCase) => {
            it(testCase.name, function() {
                let result = undefined;
                expect( () => {result = new OptionBuilder(...testCase.params)}).not.throw();
                if (testCase.test) {
                    testCase.test(result);
                }
            });
        })
    });
});

describe("Class CommandLineOption", function() {
    [
        {
            name: "Empty construction",
            params: undefined,
            test(value) {
                expect(value).instanceof(CommandLineOption);
                expect(value).property("required", false);
            }
        }
    ].forEach( (testCase) => {
        it(testCase.name, function() {
            let result = undefined;
            expect( () => {result = new CommandLineOption(testCase.params)}).not.throw();
            if (testCase.test) {
                testCase.test(result);
            }
        });
    })
});