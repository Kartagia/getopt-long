
/**
 * An array implementation of range.
 * @module utils/range/isArray
 */

import { isRange, rangeOptionOptionalProperties } from "./range.mjs";
import { defaultEquals, defaultLessThan, isRangeOptions } from "./range.mjs";

/**
 * A range of values.
 * @template [TYPE=number] The content type of the range.
 * @typedef {[value: TYPE]|[lowerBoundary: TYPE|undefined, upperBoundary: TYPE|undefined, rangeOptions?: RangeOptions<TYPE>]} ArrayRange
 */

/**
 * Test whether a value is a range boudnary.
 * @type {Predicate<any>}
 */
export function isRange(value) {
    return Array.isArray(value) && value.length > 0 && (value.length < 2 || isRangeOptions(value[2]))
}

/**
 * Create an array range.
 * @template [TYPE=number] The type of the range elemenets.
 * @param {TYPE|undefined} lowerBoundary The lower boudnary of the range.
 * @param {TYPE|undefined} upperBoundary The upper boundary of the range.
 * @param {import("./range.mjs").RangeOptions} [options] The range options.
 * @returns {ArrayRange<TYPE>} The range created by the properties.
 */
export function createRange(lowerBoundary, upperBoundary, options = undefined) {

    if (lowerBoundary === upperBoundary && lowerBoundary !== undefined && options === undefined) {
        return [lowerBoundary];
    } else if (typeof options === "string") {
        // Named range.
        return [lowerBoundary, upperBoundary, { name: options }];
    } else {
        return [lowerBoundary, upperBoundary, { ...{ openLowerBoundary: false, openUpperBoundary: false, lessThan: defaultLessThan, equals: defaultEquals }, ...(options ?? {}) }];
    }
}

/**
 * Get range options.
 * @template TYPE
 * @param {ArrayRange<TYPE>} range The range whose options are determined.
 * @returns {import("./range.mjs").RangeOptions<TYPE>|undefined}
 */
export function getRangeOptions(range) {
    if (isRange(range)) {
        if (range.length === 0 || range[2] === undefined) {
            return {};
        } else if (typeof range[2] === "string") {
            return { name: range[2] };
        } else {
            return range[2];
        }
    } else {
        return undefined;
    }
}

/**
 * Get a lower boudnary of hte range.
 * @param {ArrayRange<TYPE>} range 
 * @returns {RangeBoundary<TYPE>}
 */
export function getRangeLowerBoundary(range) {
    return [range[0],
    andThen(
        andThen(
            range[2], (value) => (typeof value === "object" && value !== null && "openBoundaries" in value), (value) => (value.openBoundaries)
        ),
        (value) => (typeof value === "object" && value !== null && "openLowerBounadry" in value),
        (value) => (value.openLowerBoundary)
    ) ?? false
    ];
}

/**
 * Get the upper boundary of a range.
 * @template [TYPE=number]
 * @param {ArrayRange<TYPE>} range 
 * @returns {TYPE} The lower boundary of the range.
 */
export function getRangeUpperBoundary(range) {
    if (range.length === 1) {
        return [range[0], false];
    }
    // Creating fro longer range option. 
    return [range[1] ?? range[0],
    andThen(
        andThen(
            range[2], (value) => (typeof value === "object" && value !== null && "openBoundaries" in value), (value) => (value.openBoundaries)
        ),
        (value) => (typeof value === "object" && value !== null && "openLowerBounadry" in value),
        (value) => (value.openLowerBoundary)
    ) ?? false
    ];
}

export default { isRange, createRange, getRangeOptions, getRangeLowerBoundary, getRangeUpperBoundary };
