let R = require('ramda');
let imgResize = require('./img-resize');
let logger = require('./logger');
let H = require('./helpers');

exports.processFile = R.curry((type, src) => {
  logger.info('Process [%s] %s', type, src);
  let dst = H.cachePath(type, src);
  return imgResize(src, dst, H.getSizeStr(type));
});
