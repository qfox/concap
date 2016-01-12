# concap

Tiny module for buffering and redirecting console methods.

## Installation

```
$ npm install concap --save
```

## Usage

### Printing one-two-three with hijacking
```js
var concap = require('concap');

console.log('1');

concap.hijack();
console.log('3'); // `3` captured here
concap.restore();

console.log('2');
concap.flush(); // and flushed here
```
will output:
```js
1
2
3
```

### Collect a `warn` call

```js
var concap = require('concap');

concap.hijack();
console.warn('buffered', /output/, function sir(){});
concap.restore();

var calls = concap.getClean();
console.log(calls);
console.log(concap.render(calls));
```
will show:
```js
[ { method: 'warn', args: [ 'buffered', /output/, function sir(){} ] } ]
console.warn("buffered", /output/, function sir(){});
```

### Using local instance of console

It is also possible to make console instance to use it locally:
```js
var concap = require('concap');

var local = new concap.Console();
var calls = [];
local.on('data', e => calls.push(e));
local.warn('today is:', new Date());

console.log(concap.render(calls, { object: 'this.cons' }));
```
will generate:
```js
this.cons.warn("today is:", new Date(1452619284325));
```

### Capturing logs using shortcut

```js
var concap = require('./');

var res = concap.capture(() => template.apply({
    head: '<link rel="icon" type="image/x-icon" href="https://assets-cdn.github.com/favicon.ico">',
    body: `<p>This is just an example of parkur ninja style.</p>
        <p>Please don't repeat this by yourself: it's dangerous!</p>`
}));

console.log(inject(res, `<script>\n${concap.render(concap.getClean())}\n</script>`));

function template() {
    console.warn('Wake up! You using deprecated template!');
    return `<html>
        <head>${this.head||''}</head>
        <body>${this.body||''}</body>
    </html>`;
}

function inject(html, log) {
    return html.replace(/(<\/body>\s*)?(<\/html>\s*)?$/, m => log + m);
}
```

```html
<html>
        <head><link rel="icon" type="image/x-icon" href="https://assets-cdn.github.com/favicon.ico"></head>
        <body><p>This is just an example of parkur ninja style.</p>
        <p>Please don't repeat this by yourself: it's dangerous!</p><script>
console.warn("Wake up! You using deprecated template!");
</script></body>
    </html>
```

## License

MIT
