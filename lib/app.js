"use strict";
//
// lib/app.js
//
var _canContinue = true;

const config = require('./config');
const rread = require('readdir-recursive');
const path = require('path');
const fs = require('fs');
const Q = require('q');
const imgResize = require('./img-resize');

var processQueue = {};
var watchers = {};

function processFile(cacheType, src) {
  return Q.Promise((res, rej) => {
    let dst = path.join(config.cacheRootDir, cacheType, src);
    let size = `${config.photos[cacheType].w}x${config.photos[cacheType].h}`;
    return imgResize(src, dst, size).then(res).catch(rej);
  });
}

function processFiles(photosArrayToProcess) {
  var fileToProcess = photosArrayToProcess.pop();
  if (fileToProcess) {
    console.log('> Process files: ' + photosArrayToProcess.length + ' files left...');
    if (_canContinue) {
      Q.all([
        processFile('thumb', fileToProcess),
        processFile('preview', fileToProcess)
      ])
      .then(() => setTimeout(() => processFiles(photosArrayToProcess), config.processingPause))
      .catch((err) => console.error(err));
    }
  } else {
    return true;
  }
}

function watchedFileChanged(watchedDir) {
  return function(event, filename) {
    console.log('watcher: event', event, ', filename', filename, ', watchedDir', watchedDir);
    let filePath = path.join(watchedDir, filename);
    processFile('thumb', filePath);
    processFile('preview', filePath);
  };
}

config.processDirs.forEach((processDir) => {
  processQueue[processDir] = processQueue[processDir] || [];
  let files = rread.fileSync(processDir).filter((filepath) => filepath.match(/\/\..+/) === null);
  processQueue[processDir] = files;
  watchers = fs.watch(processDir, {
    persistent: true,
    recursive: true
  }, watchedFileChanged(processDir));
});

for(let q in processQueue) {
  processFiles(processQueue[q]);
}

process.on('SIGTERM', () => {
  _canContinue = false;
  console.log('Stopping watchers');
  for (let w in watchers) {
    w.close();
    delete watchers[w];
  }
  console.log('watchers: ', watchers);
  watchers = null;
  processQueue = null;
  if (process.disconnect) {
    console.log('Disconnecting process');
    return process.disconnect();
  }
});
