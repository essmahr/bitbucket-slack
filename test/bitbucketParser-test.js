var test = require('ava');

var fs = require('fs');
var parser = require('../lib/bitbucketParser');
var util = require('../lib/util');

const readFile = (file, callback) => {
  return fs.readFileSync(file, { encoding: 'utf8' });
};

test('should return created message if passed created action', t => {
  const data = JSON.parse(readFile('./json/pull-request.json'));

  var out = parser.generateMessage(data, 'pullrequest:created');

  t.ok(out);
  t.regex(out.fallback, /\*created\*/);
  t.regex(out.fallback, /https:\/\/bitbucket\.org\/essmahr\/test-repo\/pull-requests\/2/);
  t.is(out.color, util.COLORS.blue);
  t.is(out.fields.length, 2);
});
