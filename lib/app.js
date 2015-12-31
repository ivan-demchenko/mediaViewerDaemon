//
// lib/app.js
//
"use strict";

var _canContinue = true;

const config = require('./config.json');
const userConfig = require('../user_config.json');

const rread = require('readdir-recursive');
const path = require('path');
const fs = require('fs');
const Q = require('q');
const R = require('ramda');
const imgResize = require('./img-resize');
const logger = require('./logger');

var processQueue = {};
var watchers = {};

const getSizeStr = (type) => `${config.photos[type].w}x${config.photos[type].h}`;

const processFile = R.curry((type, src) => {
  logger.info('Process %s: %s', type, src);
  return Q.Promise((res, rej) => {
    let dst = path.join(userConfig.cacheRootDir, type, src);
    return imgResize(src, dst, getSizeStr(type)).then(res).catch(rej);
  });
});

const checkFileFullyProcessed = function(src) {
  logger.info('Check whether the file is fully processed');
  logger.info('... file path: %s', src);
  let thumbPath = path.join(userConfig.cacheRootDir, 'thumb', src);
  let previewPath = path.join(userConfig.cacheRootDir, 'preview', src);
  return Q.all([
    Q.nfcall(fs.access, thumbPath).then(() => true).catch(() => false),
    Q.nfcall(fs.access, previewPath).then(() => true).catch(() => false)
  ]).spread((t, p) => {
    logger.info('... thumb exists: %s, preview exists: %s', t, p);
    return (!t && !p)
    ? []
    : (t && !p)
      ? ['thumb']
      : (!t && p)
        ? ['preview']
        : ['thumb', 'preview'];
  }).catch(() => []);
};

function processFiles(filesToProcess) {
  return () => {
    if (!filesToProcess.length) return true;
    if (!_canContinue) return true;

    logger.info('Process an array of files, %s files left', filesToProcess.length);

    var fileToProcess = R.head(filesToProcess);

    if (!fileToProcess) return true;

    checkFileFullyProcessed(fileToProcess)
    .then(R.compose(
      Q.all,
      R.map(R.flip(processFile)(fileToProcess)),
      R.difference(['thumb', 'preview'])
    ))
    .then(() => {
      setTimeout(
        R.compose(processFiles, R.tail)(filesToProcess),
        userConfig.processingPause
      );
    })
    .catch((err) => logger.error('Something went wrong', err));
  };
}

const watchedFileChanged = R.curry((watchedDir, event, filename) => {
  logger.info('The content of %s dir has been changes', watchedDir);
  logger.info('... event: %s, filename: %s', event, filename);
  let filePath = path.join(watchedDir, filename);
  processFile('thumb', filePath);
  processFile('preview', filePath);
});

userConfig.processDirs.forEach((dirToProcess) => {
  processQueue[dirToProcess] = processQueue[dirToProcess] || [];
  processQueue[dirToProcess] = rread.fileSync(dirToProcess).filter((filepath) => filepath.match(/\/\..+/) === null);
  watchers = fs.watch(dirToProcess, {
    persistent: true,
    recursive: true
  }, watchedFileChanged(dirToProcess));
});

for(let q in processQueue) {
  processFiles(processQueue[q])();
}

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
