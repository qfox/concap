var concap = require('../../');

describe('index', function() {
  it('should return and clean an array on calling getClean', function() {
    concap.getClean().should.be.an('array').and.empty;
  });

  it('should capture calls with arguments into buffer', function() {
    concap.hijack();
    console.log('first argument', 'second argument');
    console.warn('second call');
    concap.restore();

    var logs = concap.getClean();

    logs.should.be.an('array').with.length(2);
    logs[0].should.containSubset({method: 'log', args: ['first argument', 'second argument']});
    logs[1].should.containSubset({method: 'warn', args: ['second call']});

    concap.getClean().should.be.an('array').and.empty;
  });

  it('should emulate time-timeEnd combos with .log', function(done) {
    concap.hijack();
    console.time('xxx');
    setTimeout(() => {
      console.timeEnd('xxx');
      concap.restore();

      var msg = concap.getClean()[0].args[0];
      msg.should.match(/^xxx: [\d\.]+ms$/);
      msg.replace(/^.*?([\d\.]+).*$/, '$1').should.be.above(3).and.be.below(10);
      done();
    }, 3);
  });
});
