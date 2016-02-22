var test = require('ava');
var testUtils = require('./testUtils');

var handleEvent = require('../.tmp/handleEvent').default;

test('bitbucket event handler should propery interpret a pull request event', t => {
  const body = testUtils.getFileJson('./json/general.json');
  const eventKey = 'pullrequest:created';

  const out = handleEvent(body, eventKey);

  t.regex(out.fallback, /PR/);
});

test('bitbucket event handler should return undefined if an invalid event is passed', t => {
  const body = testUtils.getFileJson('./json/general.json');
  const eventKey = 'fakething:created';

  const out = handleEvent(body, eventKey);

  t.is(out, undefined);
});
