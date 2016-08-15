const R = require('ramda');
const imgResize = require('./img-resize');
const logger = require('./logger');
const H = require('./helpers');

exports.processFile = R.curry((type, src) => {
  logger.info('Process [%s] %s', type, src);
  let dst = H.cachePath(type, src);
  return imgResize.resize(src, dst, H.getSizeStr(type));
});
