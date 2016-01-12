var render = require('./render');
var Console = require('./Console');
var _methods = Console.ALL_METHODS;

module.exports = (function(glob) {
    var origMethods = {};
    var cons = glob.console;
    _methods.forEach(function(k) {
        origMethods[k] = cons[k]
    });

    var pseudoCons = new Console();
    _methods.forEach(function(k) {
        pseudoCons[k] = pseudoCons[k].bind(pseudoCons);
    });

    var exports = {};
    exports.hijack = function() {
        _methods.forEach(function(k) {
            cons[k] = pseudoCons[k];
        });
    };
    exports.restore = exports.noConflict = function() {
        _methods.forEach(function(k) {
            cons[k] = origMethods[k];
        });
    };
    exports.flush = function() {
        exports.getClean().forEach(function(v) {
            origMethods[v.method].apply(cons, v.args);
        });
        return exports;
    };

    // helpers for collecting calls
    var calls = [];
    exports.get = function() {
        return [].concat(calls);
    };
    exports.clean = function() {
        calls.length = 0;
        return this;
    };
    exports.getClean = function() {
        return calls.splice(0);
    };

    exports.Console = Console;
    exports.render = render;

    pseudoCons.on('data', function(e) { calls.push(e); });

    return exports;

}(typeof window !== 'undefined'? window : global));
