'use strict';

import Slack from 'node-slack';
import config from './config';

function noop() {}

export default class SlackService {
  constructor () {
    this.slack = new Slack(config.webhook);

    this.params = {
      attachments: [],
    };

    if (typeof config.username !== 'undefined') {
      this.params.username = config.username;
    }

    if (config.channel !== '#undefined' && typeof channel !== 'undefined') {
      this.params.channel = config.channel;
    }
  }

  sendMessage(message, channel) {
    // `text` is mandatory:
    this.params.text = message.fallback;
    this.params.attachments[0] = message;

    if (channel !== '') {
      this.params.channel = '#' + channel;
    }

    this.slack.send(this.params, noop);
  }
}

