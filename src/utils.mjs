
/**
 * @module utils/functions
 */


/**
 * Does value fulfil a condition.
 * @template TYPE
 * @callback Predicate
 * @param {TYPE} value The tested value.
 * @returns {boolean} True, if and only if the value fulfils the predicate.
 */

/**
 * Convert a value to a new value.
 * @template SOURCE The source type.
 * @template [RESULT=SOURCE] The result type.
 * @template [ERROR=any]
 * @callback Converter
 * @param {SOURCE} source The source value.
 * @param {string} [message] The error message. Defaults to the 
 * default error message.
 * @returns {RESULT} The result derived from the source.
 * @throws {ERROR} The source was not suitable for conversion.
 */

/**
 * Check that a value fulfils a condition.
 * @template TYPE
 * @tempalte [ERROR=any] The error type.
 * @callback Checker 
 * @param {*} value The tested value.
 * @param {string} [message] The message of the error. Defeualts to a default
 * message of the check.
 * @returns {TYPE} The wanted value derived from the value.
 * @throws {ERROR} The value did nto fulfil the condition.
 */

/**
 * ComparisonPredicate determiens whether two values fulfil a condition.
 * @template TYPE
 * @callback ComparisonPredicate
 * @param {TYPE} compared The compared value.
 * @param {TYPE} comparee The value compared to.
 * @returns {boolean|undefined} True, if and only if the compared fulfils the predicate with comparee.
 * The undefined value indicates the comparison was not possible, but interpreted as falsly value.
 */

/**
 * The basic less than operation allowing all other comparison operations.
 * @template TYPE The compared type.
 * @callback LessThan
 * @param {TYPE} compared The compared value.
 * @param {TYPE} comparee THe value compared with.
 * @returns {boolean|boolean} True, if and only if the compared is less than the comparee.
 */

/**
 * The definition of a comparison operations.
 * @template TYPE The compared type.
 * @typedef {Object} ComparisonDefinition
 * @property {LessThan<TYPE>|ComparisonPredicate<TYPE>} [lessThan] The less than operator. Defaults to the default less than.
 * @property {ComparisonPredicate<TYPE>} [equals] The equality operator. Defaults to the ZeroValueQuality of the {@external Object.equals}
 * @property {ComparisonPredicate<TYPE>} [greaterThan] The comparison for greater than. Defaults to the negation of the
 * equals and lessThan.
 * @property {ComparisonPredicate<TYPE>} [greaterThanOrEqual] The gerater than or equal comparison. Defaults to the negation
 * of the lessThan.
 * @property {ComparisonPredicate<TYPE>} [lessThanOrEqual] The less tahn or equal comparison. Defaults to the negation of the greater than.
 */

/**
 * The comparison result:
 * - 0, if the compared is equal to the comparee.
 * - <0, if teh compared is less than the comparee.
 * - >0, if teh compared is greater than the comparee.
 * - undefined, if the comparison was not possible.
 * @typedef {number|undefined} ComparisonResult
 */

/**
 * Comparison defines a comparison context.
 * @template TYPE The compared type.
 */
export class Comparison {

    /**
     * Create a new compariosn.
     * @param {ComparisonDefinition<TYPE>} param0 The defintion from which the comparison is generated.
     */
    constructor({ lessThan = defaultLessThan, greaterThan = undefined, equals = undefined, lessThanOrEqual = undefined, greaterThanOrEqual = undefined }) {
        this.lessThan = lessThan;
        this.equals = equals ?? ((compared, comparee) => (Object.equals(compared, comparee)));
        this.greaterThan = greaterThan ?? ((compared, comparee) => (!(this.lessThan(compared, comparee) || this.equals(compared, comparee))));
        this.greaterThanOrEqual = greaterThanOrEqual ?? ((compared, comparee) => (!this.lessThan(compared, comparee)));
        this.lessThanOrEqual = lessThanOrEqual ?? ((compared, comparee) => (!this.greaterThan(compared, comparee)));
    }

    /**
     * Compare two values.
     * @param {TYPE} compared The compared value.
     * @param {TYPE} comparee The value compared to.
     * @returns {ComparisonResult<TYPE>}
     */
    compare(compared, comparee) {
        return this.lessThan(compared, comparee) ? -1 : (
            this.greaterThan(compared, comparee) ? 1 : (
                this.equals(compared, comparee) ? 0 : undefined
            )
        );
    }
}

/**
 * 
 * @template TYPE The type of the value.
 * @param {TYPE|undefined|null} value The tested value.
 * @param {TYPE} defaultValue The value returned, if the value was undefined.
 * @param {TYPE} [nullValue] The value returned, if the value was null. Defaults
 * to the default value.
 * @returns {TYPE} The value of type replacing an undefined and null values with 
 * given default values.
 */
export function orElse(value, defaultValue, nullValue=undefined) {
    if (value === null) {
        return nullValue ?? defaultValue;
    } else if (value === undefined) {
        return defaultValue;
    } else {
        return value;
    }
}

/**
 * Convert a value, if it fulfils a condition.
 * @template TYPE The tested value type.
 * @param {TYPE} value The tested value.
 * @param {Predicate<TYPE>} condition The condition of conversion.
 * @param {Converter<TYPE>} converter The covnerter converting the value, if the
 * value fulfils the condition.
 * @returns {TYPE} The original value, if the value does not pass the condition.
 * The value converted with conveter otherwise.
 */
export function andThenConvert(value, condition, converter) {
    if (typeof condition === "function" && condition.length < 2 && condition(value)) {
        if (typeof converter === "function" && converter.length < 2) {
            return converter(value);
        }
    }

    // The default returns the value.
    return value;
}

/**
 * @template SOURCE
 * @template [PRIMARY_TARGET=SOURCE] The primary target type.
 * @template [SECONDARY_TARGET=PRIMARY_TARGET] The secondary target o else branch.
 * @param {SOURCE} value The tested value.
 * @param {Predicate<SOURCE>} condition The tested condition.
 * @param {Converter<SOURCE, PRIMARY_TARGET, PRIMARY_ERROR>} successConverter The converter used, if the
 * value passes the condition.
 * @param {Converter<SOURCE, SECONDARY_TARGET, SECONDARY_ERROR>} [failureConverter]
 */
export function orElseConvert(value, condition, successConverter, failureConverter) {
    if (condition(value)) {
        return successConverter(value);
    } else {
        return failureConverter(value);
    }
}