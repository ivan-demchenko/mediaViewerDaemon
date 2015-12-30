"use strict";
//
// lib/app.js
//
var _canContinue = true;

const config = require('./config.json');
const userConfig = require('../user_config.json');

const rread = require('readdir-recursive');
const path = require('path');
const fs = require('fs');
const Q = require('q');
const R = require('ramda');
const imgResize = require('./img-resize');
const processDir = userConfig.processDir;

const processFile = R.curry((type, src) => {
  console.log('>> processFile:');
  console.log('type: ', type);
  console.log('src: ', src);
  return Q.Promise((res, rej) => {
    let dst = path.join(userConfig.cacheRootDir, type, src);
    let size = `${config.photos[type].w}x${config.photos[type].h}`;
    return imgResize(src, dst, size).then(res).catch(rej);
  });
});

const checkFileFullyProcessed = function(src) {
  console.log('>> checkFileFullyProcessed: ', src, '...');
  let thumbPath = path.join(userConfig.cacheRootDir, 'thumb', src);
  let previewPath = path.join(userConfig.cacheRootDir, 'preview', src);
  return Q.all([
    Q.nfcall(fs.access, thumbPath).then(() => true).catch(() => false),
    Q.nfcall(fs.access, previewPath).then(() => true).catch(() => false)
  ]).spread((t, p) => {
    console.log('.... thumb: ', t, 'preview: ', p);
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
    if (!_canContinue) return true;

    var fileToProcess = R.head(filesToProcess);
    if (!fileToProcess) return true;

    console.log('\n\n>> Processing files: ' + filesToProcess.length + ' files left...');
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
    .catch((err) => console.error('\n\nError!\n', err));
  };
}

const watchedFileChanged = R.curry((watchedDir, event, filename) => {
  console.log('watcher: event', event, ', filename', filename, ', watchedDir', watchedDir);
  let filePath = path.join(watchedDir, filename);
  processFile('thumb', filePath);
  processFile('preview', filePath);
});

var processQueue = rread.fileSync(processDir).filter((filepath) => filepath.match(/\/\..+/) === null);
processFiles(processQueue);

var processDirWatcher = fs.watch(processDir, {
  persistent: true,
  recursive: true
}, watchedFileChanged(processDir));

process.on('SIGTERM', () => {
  _canContinue = false;
  console.log('Stopping the watcher...');
  processDirWatcher.close();
  processDirWatcher = null;
  processQueue = null;
  if (process.disconnect) {
    console.log('Disconnecting process...');
    return process.disconnect();
  }
});
