import util from '../lib/util';

function extractData(body) {
  var getKey = getPossiblyNonExtistentKey.bind(this, body);

  var data = {
    prAuthor            : getKey('pullrequest.author.display_name'),
    prUrl               : getKey('pullrequest.links.html.href'),
    prTitle             : getKey('pullrequest.title'),

    user                : getKey('actor.display_name'),

    repoName            : getKey('pullrequest.source.repository.name'),
    repoSourceName      : getKey('pullrequest.source.branch.name'),
    repoDestinationName : getKey('pullrequest.destination.branch.name'),

    reason              : getKey('repository.reason'),
    state               : getKey('repository.state'),
    description         : getKey('repository.description'),

    commentUrl          : getKey('comment.links.html.href'),
    commentContentRaw   : getKey('comment.content.raw')
  };

  return data;
}

function baseHandler(body) {
  var data = extractData(body);

  var result = {
    fields: [{
      title: data.prTitle,
      value: 'State: ' + data.state + '.',
      short: true
    }, {
      title: 'Repo / Branches:',
      value: data.repoName + ' (' + data.repoSourceName + ' → ' + data.repoDestinationName + ')',
      short: true
    }]
  };

  if (data.reason) {
    result.fields.push({
      title: 'Reason:',
      value: data.reason
    });
  }

  return { result: result, data: data };
};

const messageHandlers = {
  created: function(body) {
    var data = extractData(body);

    var result = {
      fallback: '<' + data.prUrl + '|PR *created* by ' + data.prAuthor + '> for ' + data.repoName + ':',
      color: util.COLORS.blue,
      fields: [{
        title: data.prTitle,
        value: data.repoSourceName + ' → ' + data.repoDestinationName
      }, {
        title: 'Repo / Branches:',
        value: data.repoName + ' (' + data.repoSourceName + ' → ' + data.repoDestinationName + ')',
        short: true
      }]
    };

    return result;
  },

  updated: function(body) {
    var handled = baseHandler(body);
    var result = handled.result;
    var data = handled.data;

    result.fallback = 'PR *updated* by ' + data.prAuthor + ' for ' + data.repoName + ':';
    result.color = util.COLORS.blue;

    return result;
  },

  approved: function(body) {
    var data = extractData(body);

    var result = {
      fallback: data.user + ' *approved* a PR.',
      color: util.COLORS.green
    };

    return result;
  },

  unapproved: function(body) {
    var data = extractData(body);

    var result = {
      fallback: data.user + ' *unapproved* a PR.',
      color: util.COLORS.yellow
    };

    return result;
  },

  rejected: function(body) {
    var handled = baseHandler(body);
    var result = handled.result;

    result.fallback = 'PR *rejected*:';
    result.color = util.COLORS.red;

    return result;
  },

  fulfilled: function(body) {
    var handled = baseHandler(body);
    var result = handled.result;

    result.fallback = 'PR *merged*:';
    result.color = util.COLORS.green;

    return result;
  },

  comment_created: function(body) {
    var data = extractData(body);

    var result = {
      fallback: data.user + ' *posted* <' + data.commentUrl + '|a comment> on a PR:',
      color: util.COLORS.yellow,
      fields: [{
        value: util.truncate(data.commentContentRaw)
      }]
    };

    return result;
  },

  comment_deleted: function(body) {
    var data = extractData(body);

    var result = {
      fallback: data.user + ' *deleted* <' + data.commentUrl + '|a comment> on a PR:',
      color: util.COLORS.yellow,
      fields: [{
        value: util.truncate(data.commentContentRaw)
      }]
    };

    return result;
  },

  comment_updated: function(body) {
    var data = extractData(body);

    var result = {
      fallback: data.user + ' *updated* <' + data.commentUrl + '|a comment> on a PR:',
      color: util.COLORS.yellow,
      fields: [{
        value: util.truncate(data.commentContentRaw)
      }]
    };

    return result;
  }
};

function getPossiblyNonExtistentKey(obj, keySequence) {
  const keys = keySequence.split('.');

  while (obj && keys.length) {
    obj = obj[keys.shift()];
  }

  return obj || undefined;
}

export default function generateMessage(body, eventType) {
  var supportedEvents = [
    'created',
    'updated',
    'rejected',
    'fulfilled',
    'approved',
    'unapproved',
    'comment_created',
    'comment_updated',
    'comment_deleted'
  ];

  if (!eventType || supportedEvents.indexOf(eventType) < 0) {
    console.log('the repo bot doesn\'t know what to do with trigger:', eventType);
    return undefined;
  }

  return messageHandlers[eventType](body);
}
