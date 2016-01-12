var NOOP_METHODS = 'profile profileEnd timeStamp'.split(' ');
var PURE_METHODS = ('log debug info warn error assert dir dirxml exception'
    + 'group groupCollapsed groupEnd count table').split(' ');
var REST_METHODS = 'trace time timeEnd'.split(' ');
var ALL_METHODS = REST_METHODS.concat(PURE_METHODS).concat(NOOP_METHODS);

var util = require('util');
var EventEmitter = require('events').EventEmitter;

module.exports = Console;

Console.NOOP_METHODS = NOOP_METHODS;
Console.PURE_METHODS = PURE_METHODS;
Console.REST_METHODS = REST_METHODS;
Console.ALL_METHODS = ALL_METHODS;

util.inherits(Console, EventEmitter);
function Console() {
    var _this = this;

    PURE_METHODS.forEach(function(k) { _this[k] = _push.bind(null, k); });
    NOOP_METHODS.forEach(function(k) { _this[k] = _noop; });

    function _push(method) {
        _this.emit('data', {method: method, args: Array.prototype.slice.call(arguments, 1)});
    }

    // time, timeEnd emulation
    var times = {};
    this.time = function(label) {
        if(label === undefined) return;
        times[label] = _nanoTime();
    };
    this.timeEnd = function(label) {
        if(!times[label]) return;
        this.log(label + ': ' + ((_nanoTime() - times[label]) / 1e6).toFixed(3) + 'ms');
        delete times[label];
    };

    // trace emulation
    this.trace = function() {
        this.log(new Error().trace);
    };
}

// helpers
function _noop() {}
function _nanoTime(hr) {
    return (hr = process.hrtime())[0]*1e9 + hr[1];
}
