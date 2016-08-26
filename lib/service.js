let R = require('ramda');
let path = require('path');
let imgResize = require('./img-resize');
let logger = require('./logger');
let Future = require('fluture');

const {valueDefined, cachePath, cachedCopyExists, getSizeStr, isPhoto, nonDotFile} = require('./helpers');

module.exports = {

  onFileChanged: R.curry((watchedDir, fn, event, filename) => {
    logger.info('The content of %s dir has been changes', watchedDir);
    logger.info('... event: %s, filename: %s', event, filename);
    let filePath = path.join(watchedDir, filename);
    return R.map(fn(filePath), ['thumb', 'preview']);
  }),

  // resizePhoto :: String -> String -> Promise(OperationResult)
  resizePhoto: R.curry((type, src) => {
    logger.info('resizePhoto: [%s] %s', type, src);
    let dst = cachePath(type, src);
    return imgResize(getSizeStr(type), dst, src);
  }),

  // (String -> Future(OperationResult)) -> String -> String -> Future(OperationResult)
  generateMissingFile: R.curry((fn, type, src) => {
    logger.info('generateMissingFile: [%s] %s', type, src);
    return cachedCopyExists(type, src).chainRej(fn);
  })

};
