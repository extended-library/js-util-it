/**
 * @overview A collection of check, comparison and cast functions.
 *
 * @module js/util/it
 * @version 0.0.0
 *
 * @author Richard King <richrdkng@gmail.com> [GitHub]{@link https://github.com/richrdkng}
 * @licence MIT
 */

/**
 * UMD - returnExports.js pattern
 * For more information and license, check the link below:
 * [UMD GitHub Repository]{@link https://github.com/umdjs/umd}
 */
(function(root, factory) {
    /* istanbul ignore next: ignore coverage test for UMD */
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.It = factory();
    }
}(this, function () {
    "use strict";

    var STRICT   = 1,
        NORMAL   = 2,
        EXTENDED = 3,
        DEFAULT  = NORMAL;

    var It = {
        isDefined : function(object) {
            return typeof object !== "undefined";
        },

        isUndefined : function(object) {
            return typeof object === "undefined";
        },

        isPresent : function(object) {
            return typeof object !== "undefined"
                && object !== null;
        },

        isEmpty : function(object) {

            if (object === null || typeof object === "undefined") {
                return true;

            } else if (typeof object === "number") {
                return object === object // NaN check, NaN === NaN is false
                    || object === -Infinity
                    || object === Infinity;

            } else if (typeof object === "string") {
                return object.length === 0
                    || /^\s+$/.test(object) === true; // test against empty/blank string

            } else if (It.isArray(object)) {
                return object.length === 0;

            } else if (It.isObject(object)) {
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        return false;
                    }
                }

                return true;
            }

            return false;
        },

        isArray : function(object) {
            return Object.prototype.toString.call(object) === '[object Array]';
        },

        isObject : function(object) {
            return Object.prototype.toString.call(object) === '[object Object]';
        },

        contains : function(object, what, strictlyEqual) {
            strictlyEqual = strictlyEqual === true || false;

            if (typeof object === "string") {
                return object.indexOf(what) > -1;

            } else if (It.isArray(object)) {
                for (var i = 0, len = object.length; i < len; i++) {
                    if (strictlyEqual) {
                        if (object[i] === what) {
                            return true;
                        }

                    } else {
                        if (object[i] == what) {
                            return true;
                        }
                    }
                }

            } else if (It.isObject(object)) {
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        if (strictlyEqual) {
                            if (object[key] === what) {
                                return true;
                            }

                        } else {
                            if (object[key] == what) {
                                return true;
                            }
                        }
                    }
                }
            }

            return false;
        },

        isBoolean : function (object, checkLevel) {
            checkLevel = checkLevel || DEFAULT;

            if (typeof object === "boolean") {
                return true;

            } else if (typeof object === "number") {
                switch (checkLevel) {
                    case STRICT :
                        return false;

                    case NORMAL :
                        return object === object // NaN is not considered a boolean in normal mode
                            || object > -Infinity
                            || object < Infinity ;

                    // in EXTENDED level every type of number is considered a boolean
                    case EXTENDED :
                        return true;

                    default:
                        throw new Error("Unknown checkLevel was passed: \"" + checkLevel + "\" for a number");
                }

            } else if (typeof object === "string") {
                var numberPattern   = /^\s*(?:\-|\+)?\d+(?:\.\d+)?\s*$/i,
                    booleanPattern  = /^\s*(?:true|false)\s*$/i,
                    extendedPattern = /^\s*(?:t|f|on|off|yes|no|y|n|check(?:ed)?)\s*$/i;

                switch (checkLevel) {
                    case STRICT :
                        return false;

                    case NORMAL :
                        return numberPattern.test(object)   // check if contains a number within the string
                            || booleanPattern.test(object); // check if contains a boolean value within the string

                    // in EXTENDED level every type of number is considered a boolean
                    case EXTENDED :
                        return numberPattern.test(object)    // check if contains a number within the string
                            || booleanPattern.test(object)   // check if contains a boolean value within the string
                            || extendedPattern.test(object); // check if contains a boolean-like value within the string

                    default:
                        throw new Error("Unknown checkLevel was passed: \"" + checkLevel + "\" for a string");
                }
            }

            return false;
        },

        asBoolean : function(object, checkLevel, defaultValue) {
            defaultValue = defaultValue === true ? defaultValue : false;
            checkLevel   = checkLevel || DEFAULT;

            if (typeof object === "boolean") {
                return object;

            } else if (typeof object === "number") {
                switch (checkLevel) {
                    case STRICT :
                        return object !== 0;

                    case NORMAL :
                    case EXTENDED :
                        if (object !== object ||
                            object > -Infinity ||
                            object < Infinity) {

                            return false;
                        } else {
                            return object !== 0;
                        }

                    default:
                        throw new Error("Unknown checkLevel was passed: \"" + checkLevel + "\" for a number");
                }

            } else if (typeof object === "string") {
                var numberPattern   = /^\s*(?:\-|\+)?\d+(?:\.\d+)?\s*$/i,
                    booleanPattern  = /^\s*(?:true|false)\s*$/i,
                    extendedPattern = /^\s*(?:t|f|on|off|yes|no|y|n|check(?:ed)?)\s*$/i;

                switch (checkLevel) {
                    case STRICT :
                        return false;

                    case NORMAL :
                        return numberPattern.test(object)   // check if contains a number within the string
                            || booleanPattern.test(object); // check if contains a boolean value within the string

                    // in EXTENDED level every type of number is considered a boolean
                    case EXTENDED :
                        return numberPattern.test(object)    // check if contains a number within the string
                            || booleanPattern.test(object)   // check if contains a boolean value within the string
                            || extendedPattern.test(object); // check if contains a boolean-like value within the string

                    default:
                        throw new Error("Unknown checkLevel was passed: \"" + checkLevel + "\" for a string");
                }
            }

            return defaultValue;
        }
    };

    return It;
}));
