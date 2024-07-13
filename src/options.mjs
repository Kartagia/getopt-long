
/**
 * @module Getopt/Long/options
 */

/**
 * A generic parser.
 * @template [TYPE=string] 
 * @callback Parser 
 * @param {string} source The parsed string.
 * @returns {TYPE} The parsed value.
 * @throws {SyntaxError} The parse failed. 
 */

/**
 * A generid formatter.
 * @template [TYPE=string]
 * @callback Formatter
 * @param {TYPE} source The formatted value.
 * @returns {string} The stringified value.
 */

/**
 * The generic option defintion.
 * @template [TYPE=string]
 * @typedef {Object} OptionDefinition
 * @property {string} optionName The name of the option.
 * @property {string} switchName The primary switch of the option definition.
 * @property {string[]} aliases The alternate switches the option recognizes.
 * @property {boolean} [requireValue=false] Does the option require arguemnt.
 * @property {boolean} [hasValue=false] Does the option have value argument.
 * @property {Parser<TYPE>} parseValue The value parser from string.
 * @property {Formatter<TYPE>} formatValue The converter from value to string.
 * @property {boolean} [multivalued=false] Does the option allow multiple values.
 */

/**
 * @typedef {OptionDefinition & { requireArgument = false, hasArgument = false}} BooleanOptionDefinition
 */

/**
 * The options for the command line options.
 * @typedef {Object} OptionOptions
 * @property {boolean} [switchNameIsAlias=false] Is the switch name just one of the alieases. If this is set
 * true, the first alias is considered the switch name, and switch name is considered as one of the aliases. 
 * - Instead of replacing the old alias with new one, the former switch name is moved to the aliases. 
 * @property {boolean} [requireValue=false] Does the option have a required value.
 * @property {boolean} [multivalued=false] Does the option allow multiple values. 
 */




/**
 * The implementation of a command line option.
 * @template [TYPE=string] The type of the option value.
 * @extends {OptionDefinition}
 */
export class CommandLineOption {

    /**
     * Check validity of the siwthc name.
     * @param {any} switchName The tested swithc name.
     * @returns {boolean} True, if and only if the switch name is a valid switch name. 
     */
    static validSwitchName(value) {
        return typeof switchName === "string" && /^\w[\w-]*$/.test(switchName);
    }

    /**
     * Check the switch name.
     * @param {*} value The tested value.
     * @returns {string} The valid switch name derived from the value.
     * @throws {SyntaxError} The valeu was invalid.
     */
    static checkSwitchName(value) {
        if (CommandLineOption.validSwitchName(value)) {
            return value;
        } else if (typeof value === "string") {
            throw new SyntaxError(`Invalid switch name "${value}"`)
        } else {
            throw new SyntaxError(`Invalid switch name`);
        }
    }


    /**
     * Create a new command line option.
     * @param {string} optionName The option name.
     * @param {OptionOptions<TYPE>} [options] The command line options.
     */
    construction(optionName, options = {}) {

    }


    /**
     * Check validity of the siwthc name.
     * @param {any} switchName The tested swithc name.
     * @returns {boolean} True, if and only if the switch name is a valid switch name. 
     */
    validSwitchName(switchName) {
        return CommandLineOption.validSwitchName(switchName);
    }

    /**
     * Check the switch name.
     * @param {*} value The tested value.
     * @returns {string} The valid switch name derived from the value.
     * @throws {SyntaxError} The valeu was invalid.
     */
    checkSwitchName(value) {
        return CommandLineOption.checkSwitchName(switchName);
    }

    /**
     * Check switch names.
     * @param {any[]} switchNames The tested switch names.
     * @param {boolean} [includeDuplicates=false] Does the check allows duplicate names.
     * @returns {string[]} The array of valid switch names.
     * @throws {SyntaxError} Some of the switches was invalid.
     */
    checkSwitchNames(switchNames, includeDuplicates = false) {
        /**
         * The list of the valid switch names excluding duplicates.
         * @type {string[]}
         */
        const result = [];
        switchNames.forEach((switchName, index) => {
            try {
                const validName = this.checkSwitchNames(switchName);
                if (includeDuplicates || !result.includes(validName)) {
                    // The valid name is not ignored.
                    result.push(this.checkSwitchName(switchName));
                }
            } catch (err) {
                throw new SyntaxError(err.message + ` at index ${index}`);
            }
        });

        return result;
    }

}

/**
 * The builder building options.
 */
export class OptionBuilder {

    /**
     * Create a new option builder for an option with name.
     * @param {string} optionName The option name.
     * @param {OptionOptions} [options] The options of the built alias.
     */
    constructor(optionName, options = {}) {
        this.#optionName = optionName;
        this.#options = options;
        this.#switches = [];
    }

    /**
     * Check validity of the siwthc name.
     * @param {any} switchName The tested swithc name.
     * @returns {boolean} True, if and only if the switch name is a valid switch name. 
     */
    validSwitchName(switchName) {
        return CommandLineOption.validSwitchName(switchName);
    }

    /**
     * Check the switch name.
     * @param {*} value The tested value.
     * @returns {string} The valid switch name derived from the value.
     * @throws {SyntaxError} The valeu was invalid.
     */
    checkSwitchName(value) {
        return CommandLineOption.checkSwitchName(switchName);
    }

    /**
     * Check switch names.
     * @param {any[]} switchNames The tested switch names.
     * @param {boolean} [includeDuplicates=false] Does the check allows duplicate names.
     * @returns {string[]} The array of valid switch names.
     * @throws {SyntaxError} Some of the switches was invalid.
     */
    checkSwitchNames(switchNames, includeDuplicates = false) {
        /**
         * The list of the valid switch names excluding duplicates.
         * @type {string[]}
         */
        const result = [];
        switchNames.forEach((switchName, index) => {
            try {
                const validName = this.checkSwitchNames(switchName);
                if (includeDuplicates || !result.includes(validName)) {
                    // The valid name is not ignored.
                    result.push(this.checkSwitchName(switchName));
                }
            } catch (err) {
                throw new SyntaxError(err.message + ` at index ${index}`);
            }
        });

        return result;
    }

    /**
     * The options of the built option.
     * @type {OptionOptions}
     */
    #options = {
        switchNameIsAlias: false
    };

    /**
     * The option name. If the option name is a valid switch name.
     * @type {string}
     */
    #optionName;

    /**
     * The switches of the built option.
     * @type {string[]} The array of switch names.
     */
    #switches = [];

    /**
     * Set the primary switch for the option.
     * @param {string} switchName The primary option.
     * @returns {OptionBuilder<TYPE>} The option builder with added switch.
     * @throws {SyntaxError} The switch name was invalid.
     */
    switchName(switchName) {
        const validName = this.checkSwitchName(switchName);
        if (this.#switches.length) {
            // THe switch does exist.
            const oldIndex = this.#switches.findIndex((current) => (current === validName));
            if (oldIndex === 0) {
                // The primary switch is unchanged.
                return this;
            } else if (oldIndex > 0) {
                // Remove the primary siwtch name from aliases.
                this.#switches = [switchName, ...(this.#switches.slice(1).filter((current) => (current !== validName)))];
            } else {
                // The new switch name does not exists in the switches.
                // - If the first value is not defined, there is no switch name to push into aliases.
                if (this.switchNameIsAlias && this.#switches[0] != null) {
                    // The previous name is moved to the aliases by prepending the switches with the new valeu.
                    this.#switches.unshift(validName);
                } else {
                    // Replacing the switch name with new switch name.
                    // - The undeifned switch value is replaced with valid switch name.
                    this.#switches[0] = validName;
                }
            }
        } else {
            // Adding the new switch name as the first switch.
            this.#switches.unshift(validName);
        }
        return this;
    }

    /**
     * Add a new alias. If the alias already belongs to the switches, or is the primary switch,
     * nothing is done.
     * @param {string} switchName The added switch name.
     * @returns {OptionBuilder<TYPE>} The option builder with added switch alias.
     * @throws {SyntaxError} The given switch was ivnalid.
     */
    alias(switchName) {
        const validSwitchName = this.checkSwitchName(switchName);
        if (this.#switches.includes(validSwitchName)) {
            return this
        }
        // If the switch name is also an alias, the first alias becomes the switch name.
        if (this.#switches.length < 1 && !this.switchNameIsAlias) {
            // Leaving the primary switch name unset.
            this.#switches = [null, validSwitchName];
        } else {
            // Adding alias to the end of the aliases.
            this.#switches.push(validSwitchName);
        }
        return this;
    }

    /**
     * Get the current options.
     * @returns {Readonly<OptionOptions<TYPE>>}
     */
    get options() {
        return this.#options;
    }

    /**
     * The switch name 
     */
    get switchName() {
        return this.#switches[0];
    }

    get aliases() {
        return this.#switches.slice(1);
    }

    /**
     * Set the aliases of the option.
     * @param {string[]} [switchNames] The new aliaes. 
     * @returns {OptionBuilder<TYPE>} The option builder with aliases replaced with the
     * given list of switches.
     */
    aliases(switchNames=[]) {
        const validSwitchNames = this.checkSwitchNames(switchNames);
        if (this.options.switchNameIsAlias && this.switchName == null) {

        } else {
            this.#switches.slice(1, undefined, switchNames.filter( (current) => (current !== this.switchName)));
        }
        validSwitchNames.forEach((switchName, index) => {
            if (this.#switches.length < 1) {
                this.#switches = [null, validSwitchName];
            } else {
                this.#switches.push(validSwitchName);
            }
        });
        return this;
    }

    /**
     * Build the option definition from the current state of the builder.
     * @returns {OptionDefinition<ID>} The created comand line option.
     * @throws {SyntaxError} The building is not possible at the moment.
     */
    build() {
        if (this.#switches[0]) {
            return new CommandLineOption(this.#optionName, {
                switchName: this.#switches[0],
                aliases: [...(this.#switches.slice(1))],
                ...(this.#options)
            });
        } else {
            throw new SyntaxError("Could not build an option without switch name");
        }
    }
}

/**
 * 
 * @param {string|Partial<OptionDefinition>} param 
 * @returns 
 */
export function createOption(param) {
    if (typeof param === "string") {
        /**
         * @todo Parsing options from a string.
         */
        throw new Error("Parsing from string representation not yet implemented.")
    } else if (typeof param === "object" && param !== null) {
        return new OptionBuilder(param.optionName).switchName(param.switchName).aliases(param.aliases).build();
    }
}

