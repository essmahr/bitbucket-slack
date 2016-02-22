'use strict';
import config from './config';

module.exports = {
  truncate: (string) => {
    const MAX_LENGTH = 100;

    if (string.length > MAX_LENGTH) {
      return string.substring(0, MAX_LENGTH) + ' [...]';
    }

    return string;
  },

  getPossiblyUndefinedKeyValue: (obj, keySequence) => {
    const keys = keySequence.split('.');

    while (obj && keys.length) {
      obj = obj[keys.shift()];
    }

    return obj || undefined;
  },

  COLORS: {
    red: config.danger || '#e74c3c',
    green: config.success || '#2ecc71',
    blue: config.info || '#3498db',
    yellow: config.warning ||'#f1c40f'
  }
};

