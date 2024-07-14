
/**
 * A module implementing a state parser.
 * @module StateParser
 */

/**
 * A parse result indicates the reuslt of a parse.
 * 
 * The difference between isEnd and isCompleted is the fact whether the result may be altered.
 * If the parse is at end, the parse should not continue. If the parse is complete, it may continue
 * until it reaches an error or end of the parsed value.
 * 
 * @template [RESULT=string] The result of the parse.
 * @typedef {Object} ParseResult
 * @property {RESULT} [result] The current parse result.
 * @property {boolean} [isError=false] The parse result is an error.
 * @property {boolean} [isEnd=false] The parse result is a finished parse parsing value between inclusive start index
 * and exclusive end index.
 * @property {boolean} [isCompleted=false] The parse result is a valid end of parse on error and end of parse.
 * @property {(addition: RESULT) => ParseResult<RESULT>} [appendResult] Create new parse result by 
 * appending the given addition to the current result. Optional operation.
 * @property {(newResult: RESULT) => ParseResult<RESULT>} setResult Create new parse result by 
 * setting the result to teh given result.
 */

/**
 * The action properties of the iterable parse result.
 * @template ELEMENT The element type.
 * @template {RESULT extends Iterable<ELEMENT>} RESULT The result impelementing iterable result.
 * @typedef {Object} IterableParseResultActions
 * @property {(index: number, newCurrent?: number) => IterableParseResult<ELEMENT, RESULT>} setStart Get a new parse result with start index set
 * to the given index. If the new current is not given, the current is set to the larger of the new start and the current index.
 * @property {(index: number) => IterableParseResult<ELEMENT, RESULT>} setCurrent Get a new parse result with current index set
 * to the given idnex.
 * @property {(index: number) => IterableParseResult<ELEMENT, RESULT>} setEnd Get a new parse result with end index set
 * to the given idnex.
 * @property {(index: number|undefined) => IterableParseResult<ELEMENT, RESULT>} setError Get a new parse result with errorindex set
 * to the given idnex. If error index is set to undefined value, the error status is cleared.
 * @property {(addition: ELEMENT) => IterableParseResult<ELEMENT, RESULT>} appendElement Create new parse result by 
 * appending the given addition to the current result.
 * @property {(addition: RESULT) => IterableParseResult<ELEMENT, RESULT>} [appendResult] Create new parse result by 
 * appending the given addition to the current result. Optional operation.
 * @property {(newResult: RESULT) => IterableParseResult<RESULT>} setResult Create new parse result by 
 * setting the result to teh given result.
 */

/**
 * The indexing properties of the parse result.
 * @template ELEMENT The element type.
 * @template {RESULT extends Iterable<ELEMENT>} RESULT The result impelementing iterable result.
 * @typedef {Object} IterableParseResultIndexing
 * @property {number} startIndex The index of the parse start.
 * @property {number} currentIndex The current index of the parse.
 * @property {number} [endIndex] The exclusive end index of the successful parse.
 * @property {number} [errorIndex] The index of an error. 
 */

/**
 * A parse result of an iterable result type. Iterable source always gives position
 * making iterable parse result always containing the start index.
 * @template ELEMENT The element type.
 * @template {RESULT extends Iterable<ELEMENT>} RESULT The result impelemnting iterable result.
 * @typedef {ParseResult<RESULT> & IterableParseResultIndexing<ELEMENT, RESULT> & IterableParseResultActions<ELEMENT, RESULT>} IterableParseResult 
 */


/**
 * A simple state transition does not contain indexing.
 * @template ELEMENT The element type.
 * @template {RESULT extends Iterable<ELEMENT>} [RESULT=[]] The result impelemnting iterable result.
 * @typedef {[nextState: ParseState<ELEMENT, RESULT>, newParseResult: ParseResult<RESULT>]} SimpleStateTransition
 */

/**
 * An iterable state transition contains indexing information.
 * @template ELEMENT The element type.
 * @template {RESULT extends Iterable<ELEMENT>} [RESULT=[]] The result impelemnting iterable result.
 * @typedef {[nextState: ParseState<ELEMENT, RESULT>, newParseResult: IterableParseResult<ELEMENT, RESULT>]} IterableStateTransition
 */

/**
 * The parse result of the state parse.
 * @template ELEMENT The element type.
 * @template {RESULT extends Iterable<ELEMENT>} [RESULT=[]] The result impelemnting iterable result.
 * @typedef {SimpleStateTransition<ELEMENT,RESULT>|IterableStateTransition<ELEMENT,RESULT>} StateTransition
 */

/**
 * A function performing parsing.
 * @template ELEMENT The element type.
 * @template [RESULT=Iterable<ELEMENT>] The result impelemnting iterable result.
 * @callback IterableStateParser
 * @param {ELEMENT} parsed The parsed value.
 * @param {IterableParseResult<ELEMENT, RESULT>} parseResult The current parse result.
 * @param {ParseState<RESULT>|IterableParseState<ELEMENT, RESULT>} [stateOnSuccess] The state on successful completed parse.
 * Defaults to the default successful parse state of the current state.
 * @param {ParseState<RESULT>|IterableParseState<ELEMENT, RESULT>} [stateOnFailure] The state on failed parse.
 * Defaults to the default failed parse state of the current state.
 * @returns {StateTransition<ELEMENT, RESULT>} The result of the parse.
*/


/**
 * A function performing parsing.
 * @template [ELEMENT=string] The parsed element.
 * @template [RESULT=ELEMENT[]] The resulting value.
 * @callback IterableStateParser
 * @param {ELEMENT} parsed The parsed value.
 * @param {IterableParseResult<ELEMENT, RESULT>} parseResult The current parse result.
 * @param {ParseState<RESULT>|IterableParseState<ELEMENT, RESULT>} [stateOnSuccess] The state on successful completed parse.
 * Defaults to the default successful parse state of the current state.
 * @param {ParseState<RESULT>|IterableParseState<ELEMENT, RESULT>} [stateOnFailure] The state on failed parse.
 * Defaults to the default failed parse state of the current state.
 * @returns {StateTransition<ELEMENT, RESULT>} The result of the parse.
*/


/**
 * @template [ELEMENT=string] The parsed element.
 * @template [RESULT=string] The resulting value.
 * @typedef {Object} ParseState 
 * @property {StateParser<ELEMENT, RESULT>} parse Parses the next element.
 * @property {boolean} [isError=false] Is the parse state error state.
 * @property {boolean} [isComplete=false] Is the parse state complete state. A complete
 * state failed parse ends the parse as a successful parse on error state.
 */

/**
 * @template [ELEMENT=string] The parsed element.
 * @template {RESULT extends Iterable<ELEMENT>} [RESULT=ELEMENT[]] The resulting value.
 * @typedef {Object} IterableParseState
 * @property {IterableStateParser<ELEMENT, RESULT>} parse Parses the next element.
 * @property {boolean} [isError=false] Is the parse state error state.
 * @property {boolean} [isComplete=false] Is the parse state complete state. A complete
 * state failed parse ends the parse as a successful parse on error state.
 */


/**
 * Create a default state parser.
 * @param {ParseState<RESULT>|IterableParseState<ELEMENT, RESULT>} state The state performing the initial parse.
 * @param {ParseState<RESULT>|IterableParseState<ELEMENT, RESULT>} [defaultStateOnSuccess] The default state on success, if
 * the parser does not give one. Defaults to the parse result state.
 * @param {ParseState<RESULT>|IterableParseState<ELEMENT, RESULT>} [defaultStateOnFailure] The default state on success, if
 * the parser does not give one. Defaults to the parse result state.
 * @returns {StateParser<ELEMENT, RESULT>}
 */
function defaultStateParser(state, defaultStateOnSuccess = undefined, defaultStateOnFailure = undefined) {
    /**
     * @type {StateParser<ELEMENT, RESULT>}
     */
    return (parsed, parseResult, stateOnSuccess = undefined, stateOnFailure = undefined) => {
        const [nextState, newResult] = state.parse(parsed, parseResult);
        if (nextState.isError) {
            if (state.isComplete) {
                // Completed state ignores the error state and derives the result state from the previous state on error.
                if ("currentIndex" in parseResult && "setEnd" in parseResult) {
                    // The result is iterable state, thus we update the satate.
                    return [stateOnSuccess ?? defaultStateOnSuccess ?? nextState, parseResult.setEnd(parseResult.currentIndex)];
                } else {
                    // 
                    return [stateOnSuccess ?? defaultStateOnSuccess ?? nextState, parseResult];
                }
            } else {
                if ("currentIndex" in parseResult) {
                    return [stateOnFailure ?? defaultStateOnFailure ?? nextState, (newResult.errorIndex === undefined && "setError" in newResult ? newResult.setError(parseResult.currentIndex) : newResult)];
                } else {
                    return [stateOnFailure ?? defaultStateOnFailure ?? nextState, newResult];
                }
            }
        } else {
            return [nextState, newResult];
        }
    }
}

/**
 * The parameters of the Array Parse Result.
 * @template [ELEMENT=any]
 * @typedef {Object} ArrayParseResultSpecificParams
 * @property {boolean} [createNewResult=false] Does the parse result create new array
 * after each operation.
 */

/**
 * Array parse ersult parameters.
 * @template [ELEMENT=any]
 * @typedef {ArrayParseResultSpecificParams<ELEMENT> & Partial<Omit<IterableParseResult<ELEMENT, ELEMENT[], "setStart"|"setEnd"|"setCurrent"|"setResult"|"appendElement"|"appendResult">>>} ArrayParseResultParams
 */

/**
 * @template ELEMENT The element of the iteration.
 * @template [RESULT=Iterable<ELEMENT>] The parse result type.
 * 
 * A basic implementation of the IterableParseResultIndekxing.
 * 
 * The class does only implement the indexing altering operations, but
 * appending to the result is not handled.
 * @implements {IterableParseResultIndexing<ELEMENT,RESULT>}
 */
export class IterableIndexingParseResult {

    /**
     * Create a new iberable parse 
     * @param {IterableParseResultIndexing<ELEMENT, RESULT>} [params] The initial state.
     */
    constructor(params = {}) {
        const { startIndex = 0, endIndex = undefined, errorIndex = undefined } = param;
        const { currentIndex = startIndex } = param;

        /**
         * The start index of the parse result.
         * @type {number}
         */
        this.startIndex = startIndex;
        /**
         * The end index of the parse result.
         * @type {number|undefined}
         */
        this.endIndex = endIndex;
        /**
         * The current index of the parse result.
         * @type {number}
         */
        this.currentIndex = currentIndex;
        /**
         * The error index of the parse result.
         * @type {number|undefined}
         */
        this.errorIndex = errorIndex;

    }


    /**
     *  Set the end index.
     * @param {number} currentIndex The new current index.
     * @returns {ArrayParseResult<ELEMENT, ELEMENT[]>} A array parse result
     * with current index set to the given value.
    */
    setCurrent(currentIndex) {
        if (this.createNewResult) {
            return new ArrayParseResult({ ...this, currentIndex });
        } else {
            this.currentIndex = currentIndex;
            return this;
        }
    }

    /**
     * Set the end index.
     * @param {number|undefined} endIndex The new end index.
     * @returns {ArrayParseResult<ELEMENT, ELEMENT[]>} A array parse result
     * with end index set to the given value.
     */
    setEnd(endIndex) {
        if (this.createNewResult) {
            return new ArrayParseResult({ ...this, endIndex });
        } else {
            this.endIndex = endIndex;
            return this;
        }
    }

    /**
     * Set the error index.
     * @param {number|undefined} errorIndex The new error index.
     * @returns {ArrayParseResult<ELEMENT, ELEMENT[]>} A array parse result
     * with error index set to the given value.
     */
    setError(errorIndex) {
        if (this.createNewResult) {
            return new ArrayParseResult({ ...this, errorIndex: errorIndex });
        } else {
            this.errorIndex = errorIndex;
            return this;
        }
    }

    /**
     * Set the start index.
     * @param {number} startIndex The new current index.
     * @param {number} [currentIndex] The new current index. Defaults to the
     * maximum of the new start index and the current current index.
     * @returns {ArrayParseResult<ELEMENT, ELEMENT[]>} A array parse result
     * with start and current index. index set to the given value.
     */
    setStart(startIndex, currentIndex = undefined) {
        if (this.createNewResult) {
            return new ArrayParseResult({ ...this, startIndex, currentIndex: currentIndex ?? (Math.max(this.currentIndex, startIndex)) });
        } else {
            this.startIndex = startIndex;
            this.currentIndex = currentIndex ?? (Math.max(this.currentIndex, startIndex));
            return this;
        }
    }

    get isEnd() {
        return this.endIndex !== undefined;
    }

    get isError() {
        return this.errorIndex !== undefined;
    }

}


/**
 * Check that a value is either boolean or undefined.
 * @param {*} value The tested value.
 * @returns {boolean|undefined} The valid result.
 * @throws {SyntaxError} The value is not an undefined value or a boolean value.
 */
export function checkBooleanOrUndefined(value) {
    if (value === undefined) {
        return undefined;
    } else {
        return value == true;
    }
}

/**
 * The construction parameters of an array parse result.
 * @template [ELEMENT=any] The element type.
 * @template [RESULT=ELEMENT[]] The resiöt type.
 * @typedef {IterableParseResult<ELEMENT, RESULT>} ArrayParseResultParams
 */

/**
 * An array parse result stores the result as an array.
 * 
 * It can be created either as on in place parser altering
 * the internal result, or as a creating new independent array.
 * @template [ELEMENT=any] The element type.
 * @implements {IterableParseResult<ELEMENT, ELEMENT[]>}
 */
export class ArrayParseResult extends IterableIndexingParseResult {

    /**
     * Create a new array parse result.
     * @param {ArrayParseResultParams<ELEMENT, ELEMENT[]>} [param] The construction parameters. 
     */
    constructor(param = {}) {
        super(param);
        const { createNewResult = false,
            /** @type {ELEMENT[]} */ result = [] } = param;
        const { isEnd = false, isError = false } = param;
        const { isComplete = false } = param;

        this.createNewResult = createNewResult;
        /**
         * The current result the parse result.
         * @type {ELEMENT[]}
         */
        this.result = result;

        /**
         * Is the current result at the end of parse its parse.
         * @type {boolean}
         */
        this.#isEnd = isEnd;

        /**
         * Is the current result complete result. A complete
         * result indicates the curren state may encounter a parse error
         * resulting in a complete parse.
         */
        this.#isComplete = isComplete;

        /**
         * Is the current result an erroneous result.
         * @type {boolean}
         * 
         */
        this.#isError = isError;
    }

    #isComplete = undefined;

    get isComplete() {
        return this.#isComplete ?? super.isComplete;
    }

    set isComplete(newValue) {
        this.#isComplete = checkBooleanOrUndefined(newValue);
    }

    #isError = undefined;

    get isError() {
        return this.#isError ?? super.isError;
    }
    set isError(newValue) {
        this.#isError = checkBooleanOrUndefined(newValue);
    }

    #isEnd = undefined;

    get isEnd() {
        return this.#isEnd ?? super.isEnd;
    }
    set isEnd(newValue) {
        this.#isEnd = checkBooleanOrUndefined(newValue);
    }



    appendElement(element) {
        if (this.createNewResult) {
            return new ArrayParseResult({ ...this, result: [...this.result, element] });
        } else {
            this.result.push(element);
            return this;
        }
    }

    appendResult(result) {
        if (this.createNewResult) {
            return new ArrayParseResult({ ...this, result: [...this.result, ...result] });
        } else {
            this.result.push(...result);
            return this;
        }
    }

    setResult(result) {
        if (this.createNewResult) {
            return new ArrayParseResult({ ...this, result: result });
        } else {
            this.result = result;
            return this;
        }
    }
}

/**
 * Parse state handling code points. 
 * @implements {IterableParseState<number, number[]>}
 */
export class CodePointParseState {


    /**
     * Create a new code point parse state.
     */
    constructor() {

    }

    parse(codePoint, parseResult) {
        return [this, parse]
    }

    /**
     * Convert a parse state into a string.
     * @param {IterableParseResult<number, number[]>} [parseResult] The converted parse result.
     * @returns {string} The string representation of the parse result. An undefined value
     * otherwise.
     */
    toString(parseResult = undefined) {
        if (parseResult && this.isEnd) {
            return String.fromCodePoint(parseResult.result)
        } else {
            return undefined;
        }
    }
}


/**
 * The class performing a state parser.
 * @template ELEMENT element The parsed valeus.
 * @template RESULT teh result of the parse.
 */
export default class StateParser {

    /**
     * 
     * @param {ParseState<ELEMENT, RESULT>} initialState The initial state of the parse.
     */
    constructor(initialState) {

    }

    /**
     * Parse the given source.
    * @param {Iterator<ELEMENT>} source
     */
    parseAll(source) {
        try {
            let next = source.next();
        } catch (error) {
            new StateParser.ErrorState(error);
        }
    }

}