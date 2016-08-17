//
// lib/app.js
//
"use strict";

var _canContinue = true;

const userConfig = require('../user_config.json');

const rread = require('readdir-recursive');
const path = require('path');
const fs = require('fs');
const R = require('ramda');
const imgResize = require('./img-resize');
const logger = require('./logger');

const { processFile, findMissingCacheItems } = require('./service');
const { isPhoto, nonDotFile } = require('./helper');

var processQueue = {};
var watchers = {};

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

const startWatching = (dirName) => fs.watch(dirName, {
  persistent: true, recursive: true
}, watchedFileChanged(dirName));

const getListOfFilesToProcess = R.compose(
  R.filter(R.allPass(nonDotFile, isPhoto)),
  R.flatten,
  R.map(rread.fileSync)
);

const watchDirs = R.map(startWatching)

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
