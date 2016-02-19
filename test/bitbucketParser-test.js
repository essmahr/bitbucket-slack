'use strict';

var test = require('ava');

var fs = require('fs');
var parser = require('../lib/bitbucketParser');
var util = require('../lib/util');

const readFile = (file, callback) => {
  return fs.readFileSync(file, { encoding: 'utf8' });
};

test('should return PR created message if passed created action', t => {
  const data = JSON.parse(readFile('./json/general.json'));
  var out = parser.generateMessage(data, 'pullrequest:created');

  t.ok(out);
  t.regex(out.fallback, /\*created\*/);
  t.regex(out.fallback, /https:\/\/bitbucket\.org\/essmahr\/test-repo\/pull-requests\/2/);
  t.is(out.color, util.COLORS.blue);
  t.is(out.fields.length, 2);
});

test('should return PR updated message if passed updated action', t => {
  const data = JSON.parse(readFile('./json/general.json'));
  const out = parser.generateMessage(data, 'pullrequest:updated');

  t.ok(out);
  t.regex(out.fallback, /\*updated\*/);
  t.is(out.color, util.COLORS.blue);
  t.is(out.fields.length, 2);
});

test('should return PR approved message if passed approved action', t => {
  const data = JSON.parse(readFile('./json/approval.json'));
  const out = parser.generateMessage(data, 'pullrequest:approved');

  t.ok(out);
  t.regex(out.fallback, /\*approved\*/);
  t.regex(out.fallback, /Scott Mahr/);
  t.is(out.color, util.COLORS.green);
  t.notOk(out.fields);
});

test('should return PR unapproved message if passed unapproved action', t => {
  const data = JSON.parse(readFile('./json/approval.json'));
  const out = parser.generateMessage(data, 'pullrequest:unapproved');

  t.ok(out);
  t.regex(out.fallback, /\*unapproved\*/);
  t.regex(out.fallback, /Scott Mahr/);
  t.is(out.color, util.COLORS.yellow);
  t.notOk(out.fields);
});

test('should return PR rejected message if passed rejected action', t => {
  const data = JSON.parse(readFile('./json/general.json'));
  const out = parser.generateMessage(data, 'pullrequest:rejected');

  t.ok(out);
  t.regex(out.fallback, /\*rejected\*/);
  t.is(out.color, util.COLORS.red);
  t.is(out.fields.length, 2);
});

test('should return PR merged message if passed merged action', t => {
  const data = JSON.parse(readFile('./json/general.json'));
  const out = parser.generateMessage(data, 'pullrequest:fulfilled');

  t.ok(out);
  t.regex(out.fallback, /\*merged\*/);
  t.is(out.color, util.COLORS.green);
  t.is(out.fields.length, 2);
});

test('should return PR comment created message if passed comment_created action', t => {
  const data = JSON.parse(readFile('./json/comment.json'));
  const out = parser.generateMessage(data, 'pullrequest:comment_created');

  t.ok(out);
  t.regex(out.fallback, /comment/);
  t.regex(out.fallback, /\*posted\*/);
  t.regex(out.fallback, /Scott Mahr/);
  t.regex(out.fallback, /https:\/\/bitbucket\.org\/essmahr\/test-repo\/pull-requests\/2\/_\/diff#comment-14779831/);
  t.is(out.color, util.COLORS.yellow);
  t.is(out.fields.length, 1);
});

test('should return PR comment deleted message if passed comment_deleted action', t => {
  const data = JSON.parse(readFile('./json/comment.json'));
  const out = parser.generateMessage(data, 'pullrequest:comment_deleted');

  t.ok(out);
  t.regex(out.fallback, /comment/);
  t.regex(out.fallback, /\*deleted\*/);
  t.regex(out.fallback, /Scott Mahr/);
  t.regex(out.fallback, /https:\/\/bitbucket\.org\/essmahr\/test-repo\/pull-requests\/2\/_\/diff#comment-14779831/);
  t.is(out.color, util.COLORS.yellow);
  t.is(out.fields.length, 1);
});

test('should return PR comment deleted message if passed comment_updated action', t => {
  const data = JSON.parse(readFile('./json/comment.json'));
  const out = parser.generateMessage(data, 'pullrequest:comment_updated');

  t.ok(out);
  t.regex(out.fallback, /comment/);
  t.regex(out.fallback, /\*updated\*/);
  t.regex(out.fallback, /Scott Mahr/);
  t.regex(out.fallback, /https:\/\/bitbucket\.org\/essmahr\/test-repo\/pull-requests\/2\/_\/diff#comment-14779831/);
  t.is(out.color, util.COLORS.yellow);
  t.is(out.fields.length, 1);
});

test('should return undefined if passed unknown pull request action', t => {
  var out = parser.generateMessage({'unknown': 'dunno'});
  t.notOk(out);
});

test('should return undefined if a non pullrequest event is submitted', t => {
  var out = parser.generateMessage({'unknown': 'dunno'}, 'repo:fork');
  t.notOk(out);
});
