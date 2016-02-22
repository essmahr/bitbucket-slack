import IssueParser from './events/issue';
import PullrequestParser from './events/pullrequest';

export default function handleEvent(body, eventKey) {
  eventKey = eventKey || '';

  // only support pull requests and issues at this time
  const contexts = {
    pullrequest: PullrequestParser,
    issue: IssueParser
  }

  const delimiter = eventKey.indexOf(':');
  const eventContext = eventKey.substring(0, delimiter);
  const eventType = eventKey.substring(delimiter + 1, eventKey.length);

  if (Object.keys(contexts).indexOf(eventContext) < 0) {
    console.log('the repo bot doesn\'t know what to do with trigger context:', eventContext);
    return undefined;
  }

  return contexts[eventContext](body, eventType);
}
