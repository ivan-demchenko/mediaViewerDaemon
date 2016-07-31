//
// lib/helper.js
//

const config = require('./config.json');
const userConfig = require('../user_config.json');
const rread = require('readdir-recursive');
const path = require('path');
const fs = require('fs');
const Q = require('q');
const {compose, not, isNil, curryN, length, match, lt, equals, always} = require('ramda');

module.exports = {
  // valueDefined :: * -> bool
  valueDefined: compose(not, isNil),

  // cachePath :: string -> string -> string -> string
  cachePath: curryN(3, path.join)(userConfig.cacheRootDir),

  // cachedCopyExists :: string -> string -> Promise(bool)
  cachedCopyExists: (type, src) => Q.nfcall(fs.access, cachePath(type, src)).then(always(true)).catch(always(false)),

  // getSizeStr :: string -> string
  getSizeStr: (type) => `${config.photos[type].w}x${config.photos[type].h}`,

  // isPhoto :: string -> bool
  isPhoto: compose(lt(0), length, match(/\.(jpeg|jpg)$/)),

  // nonDotFile :: string -> bool
  nonDotFile: compose(not, equals(0), length, match(/^\./))
};
