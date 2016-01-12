var assert = require('assert');
var util = require('util');
var toSource = require('tosource');

module.exports = render;

/**
 * Render calls array into a js.
 *
 * @param {Object[]} calls — A list with all calls.
 * @param {string} calls[].method - The name of called method.
 * @param {string} calls[].args - Arguments of the call.
 * @param {?Object} opts
 * @param {?string} [opts.object="console"] — The object name for methods.
 * @returns {string} — JS code.
 */
function render(calls, opts) {
    assert(Array.isArray(calls), 'Calls param should be an array')
    if(!opts) opts = {};
    var object = opts.object || 'console';
    return calls
        .map(function(call) {
            return renderItem(object, call.method, call.args);
        })
        .join('\n');
}

function renderItem(object, method, args) {
    return object + '.' + method + '(' + args.map(_toSource).join(', ') + ');';
}

// patched toSource

var UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g;
var IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g;
var NATIVE_CODE_STUB = '{ [native-code] }';

// Mapping of unsafe HTML and invalid JavaScript line terminator chars to their
// Unicode char counterparts which are safe to use in JavaScript strings.
var UNICODE_CHARS = {
    '<'     : '\\u003C',
    '>'     : '\\u003E',
    '/'     : '\\u002F',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};

function _toSource(v) {
    if (Array.isArray(v)) {
        return v.map(_toSource);
    }

    if (util.isRegExp(v)) {
        return toSource(v);
    }

    return toSource(v)
        .replace(UNSAFE_CHARS_REGEXP, function(ch) {
            return UNICODE_CHARS[ch];
        })
        .replace(IS_NATIVE_CODE_REGEXP, NATIVE_CODE_STUB)
}
