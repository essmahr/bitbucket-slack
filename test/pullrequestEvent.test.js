'use strict';

var test = require('ava');
var util = require('../.tmp/lib/util');
var testUtils = require('./testUtils');

var generateMessage = require('../.tmp/events/pullrequest').default;

test('should return PR created message if passed created action', t => {
  const data = testUtils.getFileJson('./json/general.json');
  var out = generateMessage(data, 'created');

  t.ok(out);
  t.regex(out.fallback, /\*created\*/);
  t.regex(out.fallback, /https:\/\/bitbucket\.org\/essmahr\/test-repo\/pull-requests\/2/);
  t.is(out.color, util.COLORS.blue);
  t.is(out.fields.length, 2);
});

test('should return PR updated message if passed updated action', t => {
  const data = testUtils.getFileJson('./json/general.json');
  const out = generateMessage(data, 'updated');

  t.ok(out);
  t.regex(out.fallback, /\*updated\*/);
  t.is(out.color, util.COLORS.blue);
  t.is(out.fields.length, 2);
});

test('should return PR approved message if passed approved action', t => {
  const data = testUtils.getFileJson('./json/approval.json');
  const out = generateMessage(data, 'approved');

  t.ok(out);
  t.regex(out.fallback, /\*approved\*/);
  t.regex(out.fallback, /Scott Mahr/);
  t.is(out.color, util.COLORS.green);
  t.notOk(out.fields);
});

test('should return PR unapproved message if passed unapproved action', t => {
  const data = testUtils.getFileJson('./json/approval.json');
  const out = generateMessage(data, 'unapproved');

  t.ok(out);
  t.regex(out.fallback, /\*unapproved\*/);
  t.regex(out.fallback, /Scott Mahr/);
  t.is(out.color, util.COLORS.yellow);
  t.notOk(out.fields);
});

test('should return PR rejected message if passed rejected action', t => {
  const data = testUtils.getFileJson('./json/general.json');
  const out = generateMessage(data, 'rejected');

  t.ok(out);
  t.regex(out.fallback, /\*rejected\*/);
  t.is(out.color, util.COLORS.red);
  t.is(out.fields.length, 2);
});

test('should return PR merged message if passed merged action', t => {
  const data = testUtils.getFileJson('./json/general.json');
  const out = generateMessage(data, 'fulfilled');

  t.ok(out);
  t.regex(out.fallback, /\*merged\*/);
  t.is(out.color, util.COLORS.green);
  t.is(out.fields.length, 2);
});

test('should return PR comment created message if passed comment_created action', t => {
  const data = testUtils.getFileJson('./json/comment.json');
  const out = generateMessage(data, 'comment_created');

  t.ok(out);
  t.regex(out.fallback, /comment/);
  t.regex(out.fallback, /\*posted\*/);
  t.regex(out.fallback, /Scott Mahr/);
  t.regex(out.fallback, /https:\/\/bitbucket\.org\/essmahr\/test-repo\/pull-requests\/2\/_\/diff#comment-14779831/);
  t.is(out.color, util.COLORS.yellow);
  t.is(out.fields.length, 1);
});

test('should return PR comment deleted message if passed comment_deleted action', t => {
  const data = testUtils.getFileJson('./json/comment.json');
  const out = generateMessage(data, 'comment_deleted');

  t.ok(out);
  t.regex(out.fallback, /comment/);
  t.regex(out.fallback, /\*deleted\*/);
  t.regex(out.fallback, /Scott Mahr/);
  t.regex(out.fallback, /https:\/\/bitbucket\.org\/essmahr\/test-repo\/pull-requests\/2\/_\/diff#comment-14779831/);
  t.is(out.color, util.COLORS.yellow);
  t.is(out.fields.length, 1);
});

test('should return PR comment deleted message if passed comment_updated action', t => {
  const data = testUtils.getFileJson('./json/comment.json');
  const out = generateMessage(data, 'comment_updated');

  t.ok(out);
  t.regex(out.fallback, /comment/);
  t.regex(out.fallback, /\*updated\*/);
  t.regex(out.fallback, /Scott Mahr/);
  t.regex(out.fallback, /https:\/\/bitbucket\.org\/essmahr\/test-repo\/pull-requests\/2\/_\/diff#comment-14779831/);
  t.is(out.color, util.COLORS.yellow);
  t.is(out.fields.length, 1);
});

test('should return undefined if passed unknown pull request action', t => {
  var out = generateMessage({'unknown': 'dunno'});
  t.notOk(out);
});

test('should return undefined if a non pullrequest event is submitted', t => {
  var out = generateMessage({'unknown': 'dunno'}, 'fork');
  t.notOk(out);
});
