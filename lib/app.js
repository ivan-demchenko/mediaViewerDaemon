//
// lib/app.js
//
"use strict";

var _canContinue = true;

const userConfig = require('../user_config.json');

const rread = require('readdir-recursive');
const fs = require('fs');
const R = require('ramda');
const imgResize = require('./img-resize');
const logger = require('./logger');
const Future = require('fluture');
const H = require('./helpers');

const { resizePhoto, generateMissingFile, onFileChanged } = require('./service');

//    makeThumbs :: String -> Future(Int)
const makeThumbs = generateMissingFile(resizePhoto('thumb'), 'thumb');
const makePreviews = generateMissingFile(resizePhoto('preview'), 'preview');

// const startWatching = (dirName) => fs.watch(dirName, {
//   persistent: true, recursive: true
// }, onFileChanged(dirName));

const startFilesProcessing = R.compose(
  R.map(makeThumbs),
  R.filter(R.allPass([H.nonDotFile, H.isPhoto])),
  R.flatten,
  R.map(rread.fileSync)
);

// const watchDirs = R.map(startWatching);

var app = R.compose(Future.parallel(1), startFilesProcessing);

app(userConfig.srcPaths).fork(
  logger.error,
  logger.info
)

process.on('SIGTERM', () => {
  _canContinue = false;
  logger.info('Stopping the process');
  for (let w in watchers) {
    w.close();
  }
  watchers = null;
  processQueue = null;
  if (process.disconnect) {
    logger.info('Disconnecting process');
    return process.disconnect();
  }
});
