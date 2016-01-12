var Console = require('../../').Console;

describe('Console', function() {
  it('should make safe console object', function() {
    var console = new Console();
    console.on('data', function(e) { console.called = e; });
    console.info(42);
    console.called.should.containSubset({
      method: 'info',
      args: [42]
    });
  });

  it('should emulate time-timeEnd combos with .log', function(done) {
    var console = new Console;
    console.on('data', function(e) { console.called = e; });

    console.time('xxx');
    setTimeout(() => {
      console.timeEnd('xxx');

      var msg = console.called.args[0];
      msg.should.match(/^xxx: [\d\.]+ms$/);
      msg.replace(/^.*?([\d\.]+).*$/, '$1').should.be.above(3).and.be.below(10);
      done();
    }, 3);
  });
});
