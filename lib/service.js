const rread = require('readdir-recursive');
let R = require('ramda');
let path = require('path');
let imgResize = require('./img-resize');
let logger = require('./logger');
let Future = require('fluture');

const {valueDefined, cachePath, cachedCopyExists, getSizeStr, isPhoto, nonDotFile} = require('./helpers');

//    resizePhoto :: String -> String -> Promise(OperationResult)
const resizePhoto = R.curry((type, src) => {
  logger.info('resizePhoto: [%s] %s', type, src);
  let dst = cachePath(type, src);
  return imgResize(getSizeStr(type), dst, src);
});

//    (String -> Future(OperationResult)) -> String -> String -> Future(OperationResult)
const generateMissingFile = R.curry((type, src) => {
  logger.info('generateMissingFile: [%s] %s', type, src);
  return cachedCopyExists(type, src).chainRej(resizePhoto(type));
});

const processFile = src => {
  logger.info('processFile: %s', src);
  return Future.parallel(2, [
    generateMissingFile('thumb', src),
    generateMissingFile('preview', src)
  ]);
};

const processFiles = R.compose(
  R.map(processFile),
  R.filter(R.allPass([nonDotFile, isPhoto])),
  R.flatten,
  R.map(rread.fileSync)
);

const onFileChanged = R.curry((watchedDir, event, filename) => {
  logger.info('The content of [ %s ] dir has been changes', watchedDir);
  logger.info('... event: %s, filename: %s', event, filename);
  return processFile(path.join(watchedDir, filename)).fork(
    logger.error,
    logger.info
  );
});

const startWatching = dirName =>
    fs.watch(dirName, { encoding: 'utf-8', recursive: true }, onFileChanged(dirName));

const watchDirs = R.map(startWatching);

module.exports = { watchDirs, processFiles };
