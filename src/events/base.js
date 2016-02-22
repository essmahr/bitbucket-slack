export default class baseEvent {
  constructor(eventType, body) {
    this.eventType = eventType;
    this.body = body;
  }

  _getKey() {
    const keys = keySequence.split('.');

    while (obj && keys.length) {
      obj = obj[keys.shift()];
    }

    return obj || undefined;
  }

  generateMessage() {

  }
}
