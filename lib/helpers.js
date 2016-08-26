//
// lib/helper.js
//

const config = require('./config.json');
const userConfig = require('../user_config.json');
const rread = require('readdir-recursive');
const path = require('path');
const fs = require('fs');
const R = require('ramda');
const logger = require('./logger');
const Future = require('fluture');
const {compose, not, isNil, curryN, length, match, lt, equals, always} = require('ramda');

//    cachePath :: string -> string -> string -> string
const cachePath =
  curryN(3, path.join)(userConfig.outputDir);

//    valueDefined :: * -> bool
const valueDefined =
  compose(not, isNil);

//    cachedCopyExists :: String -> String -> Promise(String)
const cachedCopyExists = R.curry((type, src) =>
  Future.node(done => fs.access(cachePath(type, src), fs.constants.F_OK, done))
    .bimap(R.always(src), R.always(src))
  );

//    getSizeStr :: string -> string
const getSizeStr = type =>
  `${config.photos[type].w}x${config.photos[type].h}`;

// isPhoto :: string -> bool
const isPhoto =
  compose(lt(0), length, match(/\.(jpeg|jpg)$/));

// nonDotFile :: string -> bool
const nonDotFile =
  compose(equals(0), length, match(/^\./));

module.exports = { cachePath, valueDefined, cachedCopyExists, getSizeStr, isPhoto, nonDotFile };
