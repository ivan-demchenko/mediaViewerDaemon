//
// lib/app.js
//
"use strict";

var _canContinue = true;

const userConfig = require('../user_config.json');

const rread = require('readdir-recursive');
const path = require('path');
const fs = require('fs');
const Q = require('q');
const R = require('ramda');
const imgResize = require('./img-resize');
const logger = require('./logger');

const {valueDefined, cachePath, cachedCopyExists, getSizeStr, isPhoto, nonDotFile} = require('./helper');

var processQueue = {};
var watchers = {};

const processFile = R.curry((type, src) => {
  logger.info('Process [%s] %s', type, src);
  let dst = cachePath(type, src);
  return imgResize(src, dst, getSizeStr(type));
});

const findMissingCacheItems = function(src) {
  logger.info('Looking for missing cache items for %s', src);
  return Q.all([
    cachedCopyExists('thumb', src),
    cachedCopyExists('preview', src)
  ])
  .spread((thumb, preview) => {
    logger.info('... thumb exists: %s, preview exists: %s', thumb, preview);
    return R.filter(valueDefined, [
      !thumb ? 'thumb' : undefined,
      !preview ? 'preview' : undefined
    ]);
  })
  .catch(() => []);
};

function processFiles(filesToProcess) {
  return () => {
    if (!_canContinue || !filesToProcess.length) return true;

    logger.info('Process an array of files, %s files left...', filesToProcess.length);

    var fileToProcess = R.head(filesToProcess);

    if (!fileToProcess) return true;

    var processTheFile = R.flip(processFile)(fileToProcess);
    var promisedFiles = R.compose(Q.all, R.map(processTheFile));

    findMissingCacheItems(fileToProcess)
    .then(missingFileTypes => missingFileTypes.length ? promisedFiles(missingFileTypes) : null)
    .then(processingResult => {
      let processTheRestOfTheFiles = processFiles(R.tail(filesToProcess));
      if (processingResult === null) {
        processTheRestOfTheFiles();
      } else {
        setTimeout(processTheRestOfTheFiles, userConfig.processingPause);
      }
    })
    .catch(err => logger.error('Something went wrong', err));
  };
}

const watchedFileChanged = R.curry((watchedDir, event, filename) => {
  logger.info('The content of %s dir has been changes', watchedDir);
  logger.info('... event: %s, filename: %s', event, filename);
  let filePath = path.join(watchedDir, filename);
  processFile('thumb', filePath);
  processFile('preview', filePath);
});

userConfig.processDirs.forEach(dirToProcess => {
  processQueue[dirToProcess] = rread.fileSync(dirToProcess).filter(nonDotFile).filter(isPhoto);
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
