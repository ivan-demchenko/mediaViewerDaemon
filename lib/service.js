let R = require('ramda');
let imgResize = require('./img-resize');
let logger = require('./logger');
let H = require('./helpers');
let Future = require('fluture');

const {valueDefined, cachePath, cachedCopyExists, getSizeStr, isPhoto, nonDotFile} = require('./helpers');

module.exports = {

  processFile: R.curry((type, src) => {
    logger.info('Process [%s] %s', type, src);
    let dst = H.cachePath(type, src);
    return imgResize(src, dst, H.getSizeStr(type));
  }),

  findMissingCacheItems: src => {
    logger.info('Looking for missing cache items for %s', src);
    return Future.parallel(2, [
        cachedCopyExists('thumb', src),
        cachedCopyExists('preview', src)
      ])
      .bimap(
        R.always([]),
        res => {
          const {thumb, preview} = res;
          logger.info('... thumb exists: %s, preview exists: %s', thumb, preview);
          return R.filter(valueDefined, [
            !thumb ? 'thumb' : undefined,
            !preview ? 'preview' : undefined
          ]);
        }
      );
  }

};
