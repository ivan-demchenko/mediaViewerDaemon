//
// lib/helper.js
//

const config = require('./config.json');
const userConfig = require('../user_config.json');
const rread = require('readdir-recursive');
const path = require('path');
const fs = require('fs');
const R = require('ramda');
const Future = require('fluture');
const {compose, not, isNil, curryN, length, match, lt, equals, always} = require('ramda');

//    cachePath :: string -> string -> string -> string
const cachePath =
  curryN(3, path.join)(userConfig.cacheRootDir);

//    valueDefined :: * -> bool
const valueDefined =
  compose(not, isNil);

//    cachedCopyExists :: string -> string -> Promise(bool)
const cachedCopyExists = (type, src) =>
  Future.node(done => fs.access(cachePath(type, src), fs.constants.F_OK, done))
        .bimap(R.always(false), R.always(true));

//    getSizeStr :: string -> string
const getSizeStr = type =>
  `${config.photos[type].w}x${config.photos[type].h}`;

// isPhoto :: string -> bool
const isPhoto =
  compose(lt(0), length, match(/\.(jpeg|jpg)$/));

// nonDotFile :: string -> bool
const nonDotFile =
  compose(equals(0), length, match(/^\./));

module.exports = { cachePath, valueDefined, cachedCopyExists, getSizeStr, isPhoto, nonDotFile }
