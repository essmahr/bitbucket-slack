'use strict';

import express from 'express';
//import favicon from 'serve-favicon';
import logger from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';

import slackService from './lib/slackService';
import bitbucketParser from './lib/bitbucketParser';

const app = express();

app.use(compression());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Set your repository\'s Pull Request POST hook to this page\'s URL.');
});

app.post('*', (req, res) => {
  const channel = req.path.substring(1);
  const eventKey = req.headers['x-event-key'];
  const message = bitbucketParser.generateMessage(req.body, eventKey);

  if (message !== undefined) {
    slackService.sendMessage(message, channel);
  }

  res.status(200).end();
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  /* eslint-disable no-unused-vars */
  app.use((err, req, res, next) => {
    /* eslint-enable no-unused-vars */
    res.status(err.status || 500)
      .send({
        message: err.message,
        error: err
      });
  });
}

// production error handler
// no stacktraces leaked to user
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  /* eslint-enable no-unused-vars */
  res.status(err.status || 500)
    .send({
      message: err.message,
      error: {}
    });
});

export default app;
