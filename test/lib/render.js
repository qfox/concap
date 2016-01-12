var render = require('../../').render;

describe('render', function() {
  it('should render info call with scalars', function() {
    render([{
      method: 'info',
      args: [42]
    }]).should.equal('console.info(42);')
  });

  it('should render several arguments with scalars', function() {
    render([{
      method: 'warn',
      args: ['asd', 42, null, false, '', true, -10.123456, undefined]
    }]).should.equal('console.warn("asd", 42, null, false, "", true, -10.123456, undefined);')
  });

  it('should render functions', function() {
    render([{
      method: 'warn',
      args: [function(x){ return y; }, console.log]
    }]).should.equal('console.warn(function (x){ return y; }, function () { [native-code] });')
  });

  it('should render regexps', function() {
    render([{
      method: 'warn',
      args: [/abc/im, new RegExp('xxx', 'g')]
    }]).should.equal('console.warn(/abc/im, /xxx/g);')
  });

  it('should escape potential xss characters', function() {
    render([{
      method: 'error',
      args: [
        '</script>',
        function(){ '</script>' },
        ['</script>'],
        new RegExp('</script>'),
        new Date('</script>')
      ]
    }]).should.equal('console.error(' + [
      '"\\u003C\\u002Fscript\\u003E"',
      'function (){ \'\\u003C\\u002Fscript\\u003E\' }',
      '"\\u003C\\u002Fscript\\u003E"',
      '/<\\/script>/',
      'new Date(NaN));'
    ].join(', '))
  });
});
