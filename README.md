bitbucket-slack-pr-hook
=======================

Receive Pull Requests notifications from Bitbucket and send them to Slack.

## Features

As for 2014-09-26 we support all BitBucket's action types:

  * created
  * updated
  * approve
  * unapprove
  * declined
  * merged
  * comment_created
  * comment_deleted
  * comment_updated

See Bitbucket's official docs: [Pull Request POST hook management](https://confluence.atlassian.com/display/BITBUCKET/Pull+Request+POST+hook+management)

## Caveats

Bitbucket does not provide all necessary data in actions responses. For example, for a `comment_*` action we don't have the PR number, link nor name.
So all we can do is something like "Comment posted for *a* PR" and then the snippet of the comment. But currently there's no way to know where did this comment came from.

## Requirements

  * [Bitbucket](https://bitbucket.org/) repository with admin rights
  * [Slack](https://slack.com/) Incoming Webhook Url: Get your Slack token from your "integrations" page
  * [Node.js](http://nodejs.org/) **OR** [Docker](https://www.docker.com/)

## Configuration

The configuration variables are set via environment variables and/or using `.env` file (environment variable takes preference over `.env` file if found).
This makes it easy to run service also in Docker container.

If you want to use `.env` file, copy the `example.env` as `.env` and modify it as needed:

```
PORT=5000
SLACK_WEBHOOKURL=https://hooks.slack.com/services/.../.../...
SLACK_USERNAME = AwesomeBot
SLACK_CHANNEL = Repository
```

Note: Setting the `SLACK_USERNAME` or `SLACK_CHANNEL` will override the settings set on the incoming webhook integration page. If you want your team to edit any of these settings without redeploying, do not add them to your `.env` file.

**Important**: if you're going to use a `.env` file AND using Docker, edit it before building the Dockerfile.

When running the service in Docker container, the config values can be provided as parameters:

```
# Starts Docker container in daemonized mode
docker run -e PORT=5000 -e SLACK_TOKEN=123123 \
  -e SLACK_DOMAIN=company -e SLACK_CHANNEL=channel \
  -p 5000:5000 -d bitbucket-slack-pr-hook
```

You can also adjust the HEX Colors for notification attachments by adjusting any environment variables in the example below.

```
#Adjust HEX colors ie: #fff000

#Updated, Created
HEX_INFO = #3498db

#Declined
HEX_DANGER = #e74c3c

#Unapprove, Comment: Created, Comment: Deleted, Comment: Updated
HEX_WARNING = #f1c40f

#Merge & Approve
HEX_SUCCESS = #2ecc71

```

## Setting up the Bitbucket

  1. In your main Bitbucket repository, go to Settings > Hooks and create a new `Pull Request POST` hook
  2. Set up the URL as `http://<server>:<port>{/<channel>}`.
    * `<server>` is your host FQDN or its IP address
    * `<port>` is either 5000 or any other you defined in the configuration section
    * `<channel>` is an optional Slack channel where you want to receive this specific notifications - if it's not defined here it will use the one you defined in Configuration -section.

## Use

### Via plain node

  1. Run `npm start` (or `node server.js`) to fire up the application (you can do `node server.js &` to run it as a daemon in your Linux box)

## Credits

This repo was inspired by: https://github.com/kfr2/bitbucket-pull-request-connector
