

/**
 * The module containing range related tools
 * @module utils/range
 */

import { isRange as isObjectRange } from "./objectRange.mjs";
import { isRange as isArrayRange } from "./arrayRange.mjs";
import { rangeIncludes } from "./objectRange.mjs";
import { getRangeOptions as getArrayRangeOptions, getRangeLowerBoundary as getArrayRangeLowerBoundary } from "./arrayRange.mjs";
import { getRangeOptions as getObjectRangeOptions, getRangeUpperBoundary as getObjectRangeUpperBoundary } from "./objectRange.mjs";
/**
 * The type of a boundary.
 * @typedef {[boundary: TYPE|undefined, open: boolean]} RangeBoundary
 */

/**
 * The range options.
 * @template TYPE The type of the range content.
 * @typedef {Object} RangeOptions
 * @property {string} [name] The name of the group.
 * @property {boolean} [openBoundaries=false] Are both boundaries open ended.
 * @property {boolean} [openLowerBoundary=openBoundaries] Is the lower boundary open ended. Defaults to the 
 * openBoundaries.
 * @property {boolean} [openUpperBoundary=openBoundaries] Is the upper boundary open ended. Defaults to the 
 * open boundaries.
 * @property {(compared: TYPE,comparee : TYPE) => boolean} [lessThan] The operator determining if value is less than other.
 * Defaults to the default operator <.
 * @property {(compared: TYPE, comparee: TYPE) => boolean} [equals] The equality operation of the entries. Defaults to the
 * Value Zero equality of the {@external Object.is}.
 */


/**
 * The dfeault equality compariosn.
 * @type {ComparisonPredicate<TYPE>}
 */
export const defaultEquals = Object.freeze( /** @type {ComparisonPredicate<TYPE>} */(compared, comparee) => (Object.is(compared, comparee)));


/**
 * Is compared less than comparee.
 * @template TYPE The type of the compared values.
 * @param {TYPE} compared The compared value.
 * @param {TYPE} comparee The value compared with. 
 * @returns {boolean} True, if and only if the compered is than compree. 
 */
export function defaultLessThan(compared, comparee) {
    return (compared < comparee);
}

/**
 * Create a range.
 * @template [TYPE=number]
 * @param {TYPE} lowerBoundary The lower boundary. 
 * @param {TYPE} upperBoundary The upper boundary.
 * @param {RangeOptions<TYPE>} [options] The range options. 
 */
export function createRange(lowerBoundary, upperBoundary, options = {}) {
    return [lowerBoundary, upperBoundary, options];
}

/**
 * The definition of a property.
 * @typedef {[property: string|symbol, validator: (value: any) => boolean]} PropertyDefinition
 */

/**
 * The required properties of an RangeOption. 
 * @template TYPE
 * @type {Readonly<PropertyDefinition<TYPE>[]>}
 */
export const rangeOptionsRequiredProperties = [];

/**
 * @template TYPE
 * The optional properties of an RnageOption. 
 * @type {Readonly<PropertyDefinition<TYPE>[]>}
 */
export const rangeOptionOptionalProperties = [
    ["name", (value) => (typeof value === "string" && value.trim().length > 0)],
    ["lessThan", (value) => (value instanceof Function && value.length === 2)],
    ["equals", (value) => (value instanceof Function && value.length === 2)],
    ["openBoundaries", (value) => (typeof value === "boolean")],
    ["openLowerBoundary", (value) => (typeof value === "boolean")],
    ["openUpperBoundary", (value) => (typeof value === "boolean")]
];

/**
 * Test, if a value is a range options.
 * @param {*} value The tested value.
 * @returns {boolean} True, if teh given value is a valid range options.
 */
export function isRangeOptions(value) {
    return value instanceof Object && !Array.isArray(value) && rangeOptionsRequiredProperties.every(
        ([prop, validator]) => ((prop in value) && (validator(value[prop]))
        )) && rangeOptionOptionalProperties.every(([prop, validator]) => ((!(prop in value)) || (validator(value[prop]))))
}

/**
 * Test if a value quacks like a range.
 * @template TYPE The range content type.
 * @param {*} value The tested value.
 * @returns {boolean} True, if and only if the range is valid range. 
 */
export function isRange(value) {
    if (Array.isArray(value)) {
        return isArrayRange(value);
    } else if (typeof value === "object" && value !== null) {
        return isObjectRange(value);
    } else {
        return false;
    }
}


/**
 * Get range options.
 * @template TYPE The type of the range values.
 * @param {*} range The range.
 * @returns {RangeOptions<TYPE>|undefined} The range options, if the range is a valid
 * range, or an undefined value otherwise.
 */
export function getRangeOptions(range) {
    if (isArrayRange(range)) {
        return getArrayRangeOptions(range);
    } else if (isObjectRange(range)) {
        return getObjectRangeOptions(range);
    } else {
        return undefined;
    }
}

/**
 * Get th lower boundary of the range.
 * @tyep TYPE The range memer type.
 * @param {*} range The range.
 * @returns {RangeBoundary<TYPE>} The lower range boundary.
 */
export function getRangeLowerBoundary(range) {
    if (isArrayRange(range)) {
        return getArrayRangeLowerBoundary(range);
    } else if (isObjectRange(range)) {
        return getObjectRangeLowerBoundary(range);
    } else {
        return undefined;
    }
}

/**
 * Get th upper boundary of the range.
 * @tyep TYPE The range memer type.
 * @param {*} range The range.
 * @returns {RangeBoundary<TYPE>} The upper range boundary.
 */
export function getRangeUpperBoundary(range) {
    if (isArrayRange(range)) {
        return getArrayRangeUpperBoundary(range);
    } else if (isObjectRange(range)) {
        return getObjectRangeUpperBoundary(range);
    } else {
        return undefined;
    }
}


/**
 * Does a range contain a value.
 * @param {Range<TYPE>} range The range. 
 * @param {TYPE} value The tested value.
 * @param {RangeOptions<TYPE>} [options] The range options.
 * @returns {boolean} True, if and only if the value is withing range. 
 */
export function contains(range, value, options = {}) {
    const { openLowerBoundary = false, openUpperBoundary = false, lessThan = defaultLessThan } = options;
    const startLessThan = (openLowerBoundary ? lessThan : ((a, b) => !lessThan(b, a)));
    const endLessThan = (openUpperBoundary ? lessThan : ((a, b) => !lessThan(b, a)));
    const lowerBoundary = getRangeLowerBoundary(range);
    const upperBoundary = getRangeUpperBoundary(range);
    return (!lowerBoundary || startLessThan(lowerBoundary, value)) &&
        (!upperBoundary || endLessThan(value, upperBoundary));
}

/**
 * Does the value belong to any ranges.
 * @template TYPE The type of the range values.
 * @param {*} value 
 * @param  {...Range<TYPE>} ranges The ranges.
 */
export function belongs(value, ...ranges) {
    return ranges.some(range => rangeIncludes(range, value, getRangeOptions(range)));
}