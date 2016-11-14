/// <reference path="../typings/index.d.ts" />
/// <reference path="./definitions/index.d.ts" />
"use strict";
var config = require('../config/file-conversion.json');
var userConfig = require('../config/user-config.json');
var ramda_1 = require('ramda');
var logger_1 = require('./logger');
var Future = require('fluture');
var fs = require('fs');
var path = require('path');
exports.cachePath = ramda_1.curryN(3, path.join)(userConfig.outputDir);
exports.valueDefined = ramda_1.compose(ramda_1.not, ramda_1.isNil);
exports.cachedCopyExists = ramda_1.curry(function (type, src) {
    logger_1.logger.info('cachedCopyExists: type: ' + type + ', src: ' + src);
    return Future.node(function (done) { return fs.access(exports.cachePath(type, src), fs.constants.F_OK, done); })
        .bimap(ramda_1.always(src), ramda_1.always(src));
});
exports.getSizeStr = function (type) {
    return (config.photos[type].w + "x" + config.photos[type].h);
};
exports.isPhoto = ramda_1.compose(ramda_1.lt(0), ramda_1.length, ramda_1.match(new RegExp('\.(jpeg|jpg)$')));
// export const nonDotFile:(name:FileSrc) => boolean =
//   compose(equals(0), length, match(new RegExp('^\.')));
