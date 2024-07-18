
/**
 * @module utils/range/object
 * 
 * The module containing the range object implementation.
 */

import { rangeOptionsRequiredProperties, rangeOptionOptionalProperties, isRangeOptions } from "./range.mjs";
import { getRangeLowerBoundary } from "./range.mjs";
import { defaultLessThan, defaultEquals } from "./range.mjs";
import { andThenConvert } from "./utils.mjs";

/**
 * The properties of the range.
 * @template [TYPE=number] The cotennt type of the range.
 * @typedef {Object} RangeProperties
 * @property {TYPE|undefined} lowerBoundary The lower boundary of the range.
 * @property {TYPE|undefined} upperBoundary The upper boundary of the range.
 */

/**
 * The methods of the range.
 * @template [TYPE=number] The cotennt type of the range.
 * @typedef {Object} RangeMethods
 * @property {Predicate<TYPE>} includes Does the range include a value.
 * @property {Predicate<RangePojo<TYPE>|RangeDefinition<TYPE>|Range<TYPE>>} contains Does the range contain a range.
 * @property {Predicate<RangePojo<TYPE>|RangeDefinition<TYPE>|Range<TYPE>>} overlaps Does the range overlap wiht a range.
 * @property {(range: RangePojo<TYPE>|RangeDefinition<TYPE>|Range<TYPE>) => Array<Range<TYPE>>} union Create a union of this range and given other range.
 * @property {(range: RangePojo<TYPE>|RangeDefinition<TYPE>|Range<TYPE>) => Range<TYPE>} intersect Create an intersection of the range and a range.
 * @property {(range: RangePojo<TYPE>|RangeDefinition<TYPE>|Range<TYPE>) => Array<Range<TYPE>>} difference Create the continous ranges by removing  range
 * from the range.
 */

/**
 * The POJO structure of the range.
 * @template [TYPE=number] The cotennt type of the range.
 * @typedef {Omit<import("./range.mjs").RangeOptions<TYPE>, "lessThan"|"equals"> & RangeProperties<TYPE>} RangePojo
 */

/**
 * The range defintion is a minimal range definition.
 * @template [TYPE=number] The cotennt type of the range.
 * @typedef {import("./range.mjs").RangeOptions<TYPE> & RangeProperties<TYPE>} RangeDefinition
 */

/**
 * The range with both data and methods.
 * @template [TYPE=number] The cotennt type of the range.
 * @typedef {RangeDefinition<TYPE> & RangeMethods<TYPE>} Range
 */


/**
 * The range construction properties.
 * @template [TYPE=number]
 * @typedef {RangePojo<TYPE>|RangeDefinition<TYPE>|Range<TYPE>} RangeProps
 */

/**
 * Create a new range.
 * @template TYPE The type of the range elements.
 * @param {RangeProps<TYPE>} [props] The properties of the range.
 * @returns {Range<TYPE>} The range created from the properties.
 * @throws {RangeError} Some of the range properties was invalid.
 */
export function createRange(props = {}) {
    return new Range(props);
}
/**
 * The default values of the object definition.
 * @template TYPE
 * @type {Required<Pick<import("./range.mjs").RangeOptions<TYPE>, "lessThan"|"equals">>}
 */
const defaultObjectDefinition = {
    lessThan: defaultLessThan,
    equals: defaultEquals
};
/**
 * Does the range contain a value.
 * @template TYPE The type of the range values.
 * @param {RangeProps<TYPE>} range The range.
 * @param {TYPE} value The tested value.
 * @param {import("./range.mjs").RangeOptions<TYPE>} [options] The range options used. if undefined, the range options of the given range
 * is used.
 */

export function isRnage(value) {
    return Array.isArray(value) && value.length > 0 && isRangeOptions(andThenConvert(value?.[2], (value) => (value == null), () => { }));
}


export function rangeIncludes(range, value, options = undefined) {
    /** @type {LessThan<TYPE>|undefined} */
    let lessThan;
    /** @type {boolean} */
    let openLowerBoundary;
    /** @type {boolean} */
    let openUpperBoundary;
    if (options) {
        lessThan = options.lessThan ?? /** @type {LessThan<TYPE>} */ defaultLessThan;
    } else if ("lessThan" in range) {
        lessThan = range.lessThan ?? /** @type {LessThan<TYPE>} */ defaultLessThan;
    } else {
        lessThan = /** @type {LessThan<TYPE>} */ defaultLessThan;
    }
    if (options) {
        openUpperBoundary = (options.openUpperBoundary) ?? false;
    } else if ("openUpperBoundary" in range) {
        openUpperBoundary = (range.openUpperBoundary) ?? false;
    } else {
        openUpperBoundary = false;
    }
    if (options) {
        openLowerBoundary = options.openLowerBoundary ?? false;
    } else if ("openLowerBoundary" in range) {
        openLowerBoundary = range.openLowerBoundary ?? false;
    } else {
        openLowerBoundary = false;
    }

    return (range.lowerBoundary === undefined || (openLowerBoundary ? lessThan(range.lowerBoundary, value) : !lessThan(value, range.lowerBoundary))) &&
        (range.upperBoundary === undefined || (openUpperBoundary ? lessThan(value, range.upperBoundary) : !lessThan(range.upperBoundary, value)));
}
/**
 * A basic range.
 * @template [TYPE=number] The value type of the range.
 * @extends {Range<TYPE>}
 */


export class BasicRange {

    /**
     * Create a new range with given lower and upper boundaries.
     * @template [TYPE=number] The value type of the range.
     * @param {TYPE|undefined} lowerBoundary The lower boundary.
     * @param {TYPE|undefined} upperBoundary The upper boundary.
     * @param {RangeOptions<TYPE>} [options] The range options.
     * @throws {RangeError} The lower or upper boundary was invalid.
     */
    static from(lowerBoundary, upperBoundary, options = {}) {
        return new BasicRange({ ...options, lowerBoundary, upperBoundary });
    }

    /**
     * Check the validity of the lower boundary.
     * @param {*} value The checked value.
     * @returns {TYPE|undefined} The valid lower boundary derived from the value.
     * @throws {Rangeerror} The value was invalid.
     */
    checkLowerBoundary(value) {
        return /** @type {TYPE|undefined} */ value;
    }
    /**
     * Check the validity of the upper boundary.
     * @param {*} value The checked value.
     * @returns {TYPE|undefined} The valid upper boundary derived from the value.
     * @throws {Rangeerror} The value was invalid.
     */
    checkUpperBoundary(value) {
        return /** @type {TYPE|undefined} */ value;
    }


    /**
     * Create a new basic range.
     * @param {RangeProps<TYPE>} range The range from which the basic range is created.
     */
    constructor(range) {
        /**
         * Is the lower boundary open ended. An open ended boundary valuedoes not belong to the range.
         * @type {boolean}
         */
        this.openLowerBoundary = (((range.openBoundaries ?? range.openLowerBoundary)) ?? false);
        /**
         * Is the upper boundary open ended. An open ended boundary value does not belong to the range.
         * @type {boolean}
         */
        this.openUpperBoundary = ((range.openBoundaries ?? range.openUpperBoundary)) ?? false;

        /**
         * Is the compared less than the comparee.
         * @type {LessThan<TYPE>}
         */
        this.lessThan = ("lessThan" in range ? range.lessThan : undefined) ?? /** @type {LessThan<TYPE>} */ defaultLessThan;
        /**
         * The lower boundary of the range.
         * @type {TYPE|undefined}
         */
        this.lowerBoundary = this.checkLowerBoundary(range.lowerBoundary);
        /**
         * The upper boundary of the range.
         * @type {TYPE|undefined}
         */
        this.upperBoundary = this.checkUpperBoundary(range.upperBoundary);
    }


    /**
     * Get the largest allowed value.
     * @param  {...(TYPE|undefined)} values values.
     * @returns {TYPE|undefined} The largest possible value. If no values are given or any value was undefined, the value is undefined.
     */
    max(...values) {
        return values.reduce((result, value) => {
            if (!("result" in result) || (result.result !== undefined && (value === undefined || this.lessThan(result.result, value)))) {
                result.result = value;
            } else {
                result.result = value;
            }
            return result;
        }, {}).result;
    }

    /**
     * Get the smallest allowed value.
     * @param  {...(TYPE|undefined)} values values.
     * @returns {TYPE|undefined} The smallest possible value. If no values are given or any value was undefined, the value is undefined.
     */
    min(...values) {
        return values.reduce((result, value) => {
            if (!("result" in result) || (result.result !== undefined && (value === undefined || this.lessThan(value, result.result)))) {
                result.result = value;
            } else {
                result.result = value;
            }
            return result;
        }, {}).result;
    }


    /**
     * The lower boundary for an intersection using comparison of the current object.
     * @param {TYPE|undefined} lowerBoundary The owner range lower boudnary.
     * @param {boolean} openLowerBoundary The lower boundary status of the owner lowre boundary.
     * @param {TYPE|undefined} intersectingLowerBoundary The intersecting lower boudnary.
     * @param {boolean} openIntersectingLowerBoundary Is the lweor boundary intersecting.
     * @returns {RangeBoundary<TYPE>} The lower range boundary.
     */
    getIntersetionLowerBoundary(lowerBoundary, openLowerBoundary, intersectingLowerBoundary, openIntersectingLowerBoundary) {
        if (lowerBoundary === intersectingLowerBoundary) {
            return openLowerBoundary ? [intersectingLowerBoundary, openIntersectingLowerBoundary] : [openLowerBoundary, openLowerBoundary];
        } else if (lowerBoundary === undefined || (intersectingLowerBoundary !== undefined && this.lessThan(lowerBoundary, intersectingLowerBoundary))) {
            // The intersecting boundary domintaes.
            return [intersectingLowerBoundary, openIntersectingLowerBoundary];
        } else {
            return [lowerBoundary, openLowerBoundary];
        }
    }

    /**
     * The upper boundary for an intersection using comparison of the current object.
     * @param {TYPE|undefined} upperBoundary The owner range upper boudnary.
     * @param {boolean} openUpperBoundary The lower boundary status of the owner upper boundary.
     * @param {TYPE|undefined} intersectingUpperBoundary The intersecting upper boudnary.
     * @param {boolean} openIntersectingUpperBoundary Is the upper boundary intersecting.
     * @returns {RangeBoundary<TYPE>} The upper range boundary.
     */
    getIntersetionUpperBoundary(upperBoundary, openUpperBoundary, intersectingUpperBoundary, openIntersectingUpperBoundary) {
        if (upperBoundary === intersectingUpperBoundary) {
            return !openUpperBoundary ? [intersectingUpperBoundary, openIntersectingUpperBoundary] : [openUpperBoundary, openUpperBoundary];
        } else if (intersectingUpperBoundary === undefined || (upperBoundary !== undefined && this.lessThan(upperBoundary, intersectingUpperBoundary))) {
            // The intersecting boundary domintaes.
            return [upperBoundary, openUpperBoundary];
        } else {
            return [intersectingUpperBoundary, openIntersectingUpperBoundary];
        }
    }


    /**
     * Get the lower boundary.
     * @param {TYPE|undefined} lowerBoundary The lower boundary.
     * @param {boolean} openLowerBoundary Is the lower boundary open ended.
     * @param {TYPE|undefined} otherLowerBoundary The other lower boundary.
     * @param {boolean} otherOpenLowerBoundary Is the other lower boundary open ended.
     * @returns {lowerBoundary: TYPE|undefined, openLowerBoundary: boolean} The new union boundary definition.
     */
    getUnionLowerBoundary(lowerBoundary, openLowerBoundary, otherLowerBoundary, otherOpenLowerBoundary) {
        if (lowerBoundary === otherLowerBoundary) {
            // The boundaries are equals - both lower boundaries has to be olen to make the boudnary open.
            return { lowerBoundary, openLowerBoundary: openLowerBoundary && otherOpenLowerBoundary };
        } else if (otherLowerBoundary === undefined || (lowerBoundary !== undefined && this.lessThan(otherLowerBoundary, lowerBoundary))) {
            return { lowerBoundary: otherLowerBoundary, openLowerBoundary: otherOpenLowerBoundary };
        } else {
            return { lowerBoundary, openLowerBoundary };
        }
    };
    /**
     * Get the upper boundary from given boundaries.
     * @param {TYPE|undefined} upperBoundary The upper boundary.
     * @param {boolean} openUpperBoundary is the upper boundary open ended.
     * @param {TYPE|undefined} otherUpperBoundary The other upper boundary.
     * @param {boolean} otherOpenUpperBoundary Is the other upper boundary open ended.
     * @returns {{uppeBoundary: TYPE|undefined, openUpperBoundary: boolean}} The upper boundary.
     */
    getUnionUpperBoundary(upperBoundary, openUpperBoundary, otherUpperBoundary, otherOpenUpperBoundary) {
        if (upperBoundary === otherUpperBoundary) {
            return { upperBoundary, openUpperBoundary: (openUpperBoundary && otherOpenUpperBoundary) };
        } else if (otherUpperBoundary === undefined || (uppeBoundary !== undefined && this.lessThan(upperBoundary, otherUpperBoundary))) {
            return { upperBoundary: otherUpperBoundary, openUpperBoundary: otherUpperBoundary };
        } else {
            return { upperBoundary, openUpperBoundary };
        }
    };

    /**
     * Test if the other range is compatible with the current range.
     * @param {RangeProps<TYPE>} other The tested range.
     * @returns {oolean} True, if and only if the range is compatible with the current range.
     */
    isCompatibleRange(other) {
        return (!("lessThan" in other)) || Object.is(this.lessThan, other.lessThan);
    }

    /**
     * Check validity a range.
     * @param {RangeProps<TYPE>} other
     * @param {string} message The rror message on failrue.
     * @returns {RangeProps<TYPE>} The other value as it is valid range candidate.
     */
    checkRange(other, message = "The range is not compatible") {
        if (this.isCompatibleRange(other)) {
            if ("openLowerBoundary" in other || "openUpperBoundary" in other || "openBoundaries" in other) {
                if ("intersect" in other) {
                    return /** @type {Range<TYPE>} */ other;
                } else if ("lessThan" in other) {
                    return /** @type {RangeDefinition<TYPE>} */ other;
                } else {
                    return /** @type {RangePojo<TYPE>} */ other;
                }
            } else {
                // POJO
                return /** @type {RangePojo<TYPE>} */ other;
            }
        } else {
            throw new RangeError(message);
        }
    }

    /**
     * Create range(s) containing the elements of both this range and given range.
     * @param {Range<TYPE>|RangePojo<TYPE>} other The other range.
     * @returns {Array<Range<TYPE>>} The ranges created by the union of the range range
     * and the other range. All members of either range belongs to some returned range.
     */
    union(other) {
        range = this.checkRange(other);

        /**
         * The resulting ranges.
         * @type {Array<Range<TYPE>>}
         */
        const result = [];
        if (!this.lessThan(this.upperBoundary, this.lowerBoundary) || !this.lessThan(range.upperBoundary, range.lowerBoundary)) {
            if (this.includes(range.lowerBoundary) && rangeIncludes(range, this.upperBoundary, this)) {
                // The ranges can be combined.
                return new BasicRange({
                    ...this,
                    ...this.getUnionLowerBoundary(this.lowerBoundary, this.openLowerBoundary, range.lowerBoundary, range.openLowerBoundary ?? false),
                    ...this.getUnionUpperBoundary(this.upperBoundary, this.openUpperBoundary, range.upperBoundary, range.openUpperBoundary ?? false)
                });
            } else {
                // The union paticipants are distinct ranges.
                // Returning the ranges in increasing order of lower boundaries.
                const newOther = new BasicRange({
                    ...this, lowerBoundary: range.lowerBoundary, openLowerBoundary: range.openLowerBoundary,
                    upperBoundary: range.upperBoundary, openUpperBoundary: range.openUpperBoundary
                });
                if (this.lowerBoundary === undefined || range.lowerBoundary !== undefined && this.lessThan(this.lowerBoundary, range.lowerBoundary)) {
                    return [this, newOther];
                } else {
                    return [newOther, this];
                }
            }
        } else {
            // Both were empty ranges.
        }
        return result;
    }

    /**
     * Create an intersection with a range.
     * @param {RangeProps<TYPE>} other The range intersected with.
     * @returns {Range<TYPE>} The range containing the intersection with the other range.
     */
    intersect(other) {
        const [lowerBoundary, openLowerBoundary] = this.getIntersetionLowerBoundary(this.lowerBoundary, this.openLowerBoundary,
            other.lowerBoundary, other.openLowerBoundary ?? false
        );
        const [upperBoundary, openUpperBoundary] = this.getIntersetionUpperBoundary(this.upperBoundary, this.openUpperBoundary, other.upperBoundary, other.openUpperBoundary ?? false);
        return new BasicRange({
            ...this, lowerBoundary, openLowerBoundary, upperBoundary, openUpperBoundary
        });
    }

    /**
     * Get the ranges created by removing a range from this range.
     * @param {RangeProps<TYPE>} other The removed range.
     * @returns {Range<TYPE>[]} The array of ranges created by removing the other from the range.
     */
    difference(other) {
        /**
         * @type {Array<Range<TYPE>>}
         */
        const result = [];
        /**
         * Get the lower boundary.
         * @param {TYPE|undefined} lowerBoundary The lower boundary.
         * @param {boolean} openLowerBoundary Is the lower boundary open ended.
         * @param {TYPE|undefined} otherLowerBoundary The other lower boundary.
         * @param {boolean} otherOpenLowerBoundary Is the other lower boundary open ended.
         * @returns {lowerBoundary: TYPE|undefined, openLowerBoundary: boolean} The new union boundary definition.
         */
        const getRangeLowerBoundary = (lowerBoundary, openLowerBoundary, otherLowerBoundary, otherOpenLowerBoundary) => {
            if (lowerBoundary === otherLowerBoundary) {
                // The boundaries are equals - both lower boundaries has to be olen to make the boudnary open.
                return { lowerBoundary, openLowerBoundary: openLowerBoundary && otherOpenLowerBoundary };
            } else if (otherLowerBoundary === undefined || (lowerBoundary !== undefined && this.lessThan(otherLowerBoundary, lowerBoundary))) {
                return { lowerBoundary: otherLowerBoundary, openLowerBoundary: otherOpenLowerBoundary };
            } else {
                return { lowerBoundary, openLowerBoundary };
            }
        };
        /**
         * Get the upper boundary from given boundaries.
         * @param {TYPE|undefined} upperBoundary The upper boundary.
         * @param {boolean} openUpperBoundary is the upper boundary open ended.
         * @param {TYPE|undefined} otherUpperBoundary The other upper boundary.
         * @param {boolean} otherOpenUpperBoundary Is the other upper boundary open ended.
         * @returns {{uppeBoundary: TYPE|undefined, openUpperBoundary: boolean}} The upper boundary.
         */
        const getRangeUpperBoundary = (upperBoundary, openUpperBoundary, otherUpperBoundary, otherOpenUpperBoundary) => {
            if (upperBoundary === otherUpperBoundary) {
                return { upperBoundary, openUpperBoundary: (openUpperBoundary && otherOpenUpperBoundary) };
            } else if (otherUpperBoundary === undefined || (uppeBoundary !== undefined && this.lessThan(upperBoundary, otherUpperBoundary))) {
                return { upperBoundary: otherUpperBoundary, openUpperBoundary: otherUpperBoundary };
            } else {
                return { upperBoundary, openUpperBoundary };
            }
        };

        if (this.includesLowerBoundary(other.lowerBoundary, other.openLowerBoundary) && this.includesUpperBoundary(other.upperBoundary, other.openUpperBoundary)) {
            // The difference affects the ranges.   
            if (Object.equals(other.lowerBoundary, this.lowerBoundary) && (this.openLowerBoundary || !other.openLowerBoundary)) {
                // There is at most one rageion - the area above the given range.
                if (!(Object.equals(other.upperBoundary, this.upperBoundary) && (this.openUpperBoundary || !other.openUpperBoundary))) {
                    // There is range from upper boundary of the removed range with negated openess. 
                    result.push(new BasicRange({ ...this, lowerBoundary: other.upperBoundary, openUpperBoundary: !other.openUpperBoundary }));
                }
            } else if (Object.equals(other.upperBoundary, this.upperBoundary) && (this.openUpperBoundary || !other.openUpperBoundary)) {
                if (!(Object.equals(other.lowerBoundary, this.lowerBoundary) && (this.openLowerBoundary || !other.openLowerBoundary))) {
                    // There is range from upper boundary of the removed range with negated openess. 
                    result.push(new BasicRange({ ...this, lowerBoundary: other.upperBoundary, openUpperBoundary: !other.openUpperBoundary }));
                }
            } else {
                // The is two ranges. 
                result.push(new BasicRange({ ...this, upperBoundary: other.lowerBoundary, openUpperBoundary: !other.openUpperBoundary }));
                result.push(new BasicRange({ ...this, lowerBoundary: other.upperBoundary, openLowerBoundary: !other.openLowerBoundary }));
            }
        } else if (this.includesLowerBoundary(other.LowerBoundary, other.openLowerBoundary)) {
            // The range contains lower boundary, but not upper boundary.
            if (!(Object.equals(this.lowerBoundary, other.lowerBoundary) && (this.openLowerBoundary || !other.openLowerBoundary))) {
                // Other range cuts the upper end of the range.
                result.push(new BasicRange({ ...this, upperBoundary: other.lowerBoundary, openUpperBoundary: !other.openLowerBoundary }));
            }
        } else if (this.includesUpperBoundary(other.upperBoundary, other.openUpperBoundary)) {
            if (!((Object.equals(this.upperBoundary, other.upperBoundary)) && (this.openUpperBoundary || !other.openUpperBoundary))) {
                // The range cotnains upper boundary, but not lower boundary.
                result.push(new BasicRange({ ...this, upperGBoundary: other.lowerBoundary, openUpperBoundary: !other.openLowerBoundary }));
            }
        } else if (!(
            (
                other.lowerBoundary === undefined || this.lessThan(other.upperBoundary, this.lowerBoundary)
            ) &&
            (
                other.upperBoundary === undefined || this.lessThan(this.upperBoundary, other.lowerBoundary)
            )
        )) {
            // The rsult contains the whole current range.
            result.push(this);
        }

        // Return the resulting ranges.
        return result;
    }

    /**
     *
     * @template TYPE the type of the range values.
     * @param {Range<TYPE>|RangeProperties<TYPE>|RangeDefinition<TYPE>} lowerBoundary
     * @param {boolean} openLowerBoundary Does the lower boundary belong to the range.
     * @param {Range<TYPE>|RangeProperties<TYPE>|RangeDefinition<TYPE>} upperBoundary
     * @param {boolean} openUpperBoundary  Does the upper boundary belong to the range.
     * @param {import("./range.mjs").RangeOptions<TYPE>} [options] The range options.
     */
    static isEmpty(lowerBoundary, openLowerBoundary, upperBoundary, openUpperBoundary, options = {}) {
        const lessThan = options.lessThan ?? defaultLessThan;
        const equals = options.equals ?? defaultEquals;
        return lowerBoundary !== undefined && upperBoundary !== undefined && (lessThan(this.upperBoundary, this.lowerBoundary) ||
            ((openLowerBoundary || openUpperBoundary) && equals(lowerBoundary, upperBoundary)));
    }

    /**
     * Is the range empty.
     * @returns {boolean}
     */
    get isEmpty() {
        return BasicRange.isEmpty(this.lowerBoundary, this.openLowerBoundary, this.upperBoundary, this.openUpperBoundary, this);
    }

    /**
     * Get the ranges created by removing a range from this range.
     * @param {RangeProps<TYPE>} other The removed range.
     * @returns {Range<TYPE>[]} The array of ranges created by removing the other from the range.
     */
    overlaps(range) {
        if (isRange(range) && !this.isEmpty) {
            /**
             * @type {RangeBoundary<TYPE>}
             */
            const otherLowerBoundary = getRangeLowerBoundary(range);
            return this.includesLowerBoundary(...otherLowerBoundary) && (this.includesUpperBoundary(...upperBoundary) || this.incd);
            this.includesLowerBoundary(this.getUnionLowerBoundary(this.lowerBoundary, this.openLowerBoundary,
                ...otherLowerBoundary
            )) && this.includes;
        } else {
            // Not a range.
            return false;
        }
    }

    /**
     * Does a value belong to the range.
     * @param {TYPE} value The tested value.
     * @returns {boolean} True, if and only if the value belongs to the range.
     */
    includes(value) {
        // The value is withing boudnary, if it is withing both boundaries.
        return this.withinLowerBoundary(value) && this.withinUpperBoundary(value);
    }


    /**
     * Is the value within upper boundary.
     * @param {TYPE|undefined} value THe tested value.
     * @param {boolean} [openBoundary] The value of hte open lower boundary. Defaults to the
     * open lower boundary of the range.
     * @returns {boolean} True, if and only if the value is within upper boundary.
     */
    withinUpperBoundary(value, openBoundary = undefined) {
        openBoundary = openBoundary ?? this.openUpperBoundary;
        if (value === undefined) {
            return this.upperBoundary === undefined && !openBoundary;
        } else {
            return this.upperBoundary === undefined || (openBoundary ? this.lessThan(value, this.upperBoundary) : !this.lessThan(this.upperBoundary, value));
        }
    }

    /**
     * Is the value within lower boundary.
     * @param {TYPE|undefined} value THe tested value.
     * @param {boolean} [openBoundary] Is the lower boundary open. Defaults to the
     * open lower boundary of the range.
     * @returns {boolean} True, if and only if the value is within lower boundary.
     */
    withinLowerBoundary(value, openBoundary = undefined) {
        openBoundary = openBoundary ?? this.openLowerBoundary;
        if (value === undefined) {
            return this.lowerBoundary === undefined && !openBoundary;
        } else {
            return this.lowerBoundary === undefined || (openBoundary ? this.lessThan(this.lowerBoundary, value) : !this.lessThan(value, this.lowerBoundary));
        }
    }

    /**
     * Does the upper boundary value belong to the boundary.
     * @param {TYPE|undefined} boundaryValue The boundary value.
     * @param {boolean} [openUpperBoundary] Is the tested boundary value open boundary value.
     * @returns {boolean} True, if and only if the given upper boundary value belongs to the range.
     */
    includesUpperBoundary(boundaryValue, openUpperBoundary = false) {
        return (boundaryValue === undefined || this.withinLowerBoundary(boundaryValue)) &&
            this.withinUpperBoundary(boundaryValue, openUpperBoundary && this.openUpperBoundary);
    }

    /**
     * Does the lower boundary value belong to the boundary.
     * @param {TYPE|undefined} boundaryValue The boundary value.
     * @param {boolean} [openLowerBoundary] Is the tested boundary value open boundary value.
     * @returns {boolean} True, if and only if the given lower boundary value belongs to the range.
     */
    includesLowerBoundary(boundaryValue, openLowerBoundary = false) {
        return (boundaryValue === undefined || this.withinUpperBoundary(boundaryValue)) &&
            this.withinLowerBoundary(boundaryValue, this.openLowerBoundary && openLowerBoundary);
    }
}

/**
 * The required properties of an RangeOption.
 * @template TYPE
 * @type {Readonly<PropertyDefinition<TYPE>[]>}
 */
const rangePropertiesRequiredProperties = [];
/**
 * @template TYPE
 * The optional properties of an RangeProperties.
 * @type {Readonly<PropertyDefinition<TYPE>[]>}
 */
const rangePropertiesOptionalProperties = [
    [lowerBoundary, (/** @type {TYPE} */ value) => (true)],
    [upperBoundary, (/** @type {TYPE} */ value) => (true)]
];
/**
 * The required properties of an RangeMethods.
 * @template TYPE
 * @type {Readonly<PropertyDefinition<TYPE>[]>}
 */
const rangeMethodsRequiredProperties = [
    ["includes", (value) => (value instanceof Function && value.length === 1)],
    ["contains", (value) => (value instanceof Function && value.length === 1)],
    ...(["intersection", "union", "difference"].map(prop => ([prop, (value) => (value instanceof Function && value.length === 1)])))
];
/**
 * The optional properties of an RangeMethods.
 * @template TYPE
 * @type {Readonly<PropertyDefinition<TYPE>[]>}
 */
const rangeMethodsOptionalProperties = [];
/**
 * @template TYPE
 * @type {Readonly<PropertyDefinition<TYPE>[]>}
 */
const rangeRequiredProperties = [
    ...( /** @type {Readonly<OptionDefinition<TYPE>[]>} */rangePropertiesRequiredProperties),
    ...( /** @type {Readonly<OptionDefinition<TYPE>[]>} */rangeOptionsRequiredProperties),
    ...( /** @type {Readonly<OptionDefinition<TYPE>[]>} */rangeMethodsRequiredProperties)
];
const rangeOptionalProperties = [
    ...( /** @type {Readonly<OptionDefinition<TYPE>[]>} */rangePropertiesOptionalProperties),
    ...( /** @type {Readonly<OptionDefinition<TYPE>[]>} */rangeOptionOptionalProperties),
    ...( /** @type {Readonly<OptionDefinition<TYPE>[]>} */rangeMethodsOptionalProperties)
];

/**
 * Test if a value quacks like a range.
 * @template TYPE The range content type.
 * @param {*} value The tested value.
 * @returns {boolean} True, if and only if the range is valid range. 
 */
export function isRange(value) {
    return value instanceof BasicRange || (rangeRequiredProperties.every(([prop, validator]) => (
        prop in value && validator(value[prop])
    ))) && (rangeOptionalProperties.every(([prop, validator]) => ((!prop in value) || (vlaidator(value[prop])))));
}

/**
 * Get the upper boundary of the range.
 * @template TYPE 
 * @param {RangeProps<TYPE>} range
 * @return {import("./range.mjs").RangeBoundary<TYPE>|undefined}
 */
export function getRangeLowerBoundary(range) {
    if (isRange(range)) {
        return [range.lowerBoundary, (range.openBoundaries ?? range.openLowerBoundary) ?? false];
    } else {
        return undefined;
    }
}

/**
 * Get the upper boundary of the range.
 * @template TYPE 
 * @param {RangeProps<TYPE>} range
 * @return {import("./range.mjs").RangeBoundary<TYPE>|undefined}
 */
export function getRangeUpperBoundary(range) {
    if (isRange(range)) {
        return [range.upperBoundary, (range.openBoundaries ?? range.openUpperBoundary) ?? false];
    } else {
        return undefined;
    }
}


export default { isRange, createRange, getRangeOptions, getRangeLowerBoundary, getRangeUpperBoundary };
