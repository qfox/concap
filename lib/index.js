var NOOP_METHODS = 'profile profileEnd timeStamp'.split(' ');
var PURE_METHODS = ('log debug info warn error assert dir dirxml exception'
    + 'group groupCollapsed groupEnd count table').split(' ');
var OTHER_METHODS = 'trace time timeEnd'.split(' ');
var ALL_METHODS = OTHER_METHODS.concat(PURE_METHODS).concat(NOOP_METHODS);

module.exports = (function(glob) {
    var origMethods = {};
    var cons = glob.console;
    ALL_METHODS.forEach(k => origMethods[k] = cons[k]);

    var calls = [];
    var times = {};

    var exports = {};
    exports.hijack = function() {
        PURE_METHODS.forEach(k => cons[k] = _push.bind(null, k));
        NOOP_METHODS.forEach(k => cons[k] = _noop);

        cons.time = function(label) {
            if(label === undefined) return;
            times[label] = _nanoTime();
        };
        cons.timeEnd = function(label) {
            if(!times[label]) return;
            cons.log(label + ': ' + ((_nanoTime() - times[label]) / 1e6).toFixed(3) + 'ms');
            delete times[label];
        };
        cons.trace = function() {
            cons.log(new Error().trace);
        };
    };
    exports.restore = exports.noConflict = function() {
        ALL_METHODS.forEach(k => cons[k] = origMethods[k]);
    };
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
    exports.flush = function() {
        calls.forEach(v => origMethods[v.method].apply(cons, v.args));
        calls.length = 0;
        return this;
    };

    return exports;

    // functional helpers
    function _noop() {}
    function _push(method) {
        calls.push({method: method, args: Array.prototype.slice.call(arguments, 1)});
    }
}(typeof window !== 'undefined'? window : global));

// time helpers
function _nanoTime(hr) {
    return (hr = process.hrtime())[0]*1e9 + hr[1];
}
