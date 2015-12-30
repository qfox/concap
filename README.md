# concap

Tiny module for buffering and redirecting console methods.

## Installation

```
$ npm install concap --save
```

## Usage

```js
var concap = require('concap');

// Collect warn
concap.hijack();
console.warn('buffered', 'output');
concap.restore();
var calls = concap.getClean();

// Output 1, 2, 3
console.log('1');

concap.hijack();
console.log('3');
concap.restore();

console.log('2');
concap.flush(); // 3 here

console.log(calls);
```

will output:

```
1
2
3
[ { method: 'warn', args: [ 'buffered', 'output' ] } ]
```

## License

MIT
