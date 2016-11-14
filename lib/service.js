/// <reference path="../typings/index.d.ts" />
/// <reference path="./definitions/index.d.ts" />
/// <reference path="./interfaces.ts" />
"use strict";
var fsReaddir = require('fs-readdir');
var baconjs_1 = require('baconjs');
var ramda_1 = require('ramda');
var path = require('path');
var fs = require('fs');
var img_resize_1 = require('./img-resize');
var logger_1 = require('./logger');
var Future = require('fluture');
var helpers_1 = require('./helpers');
exports.resizePhoto = ramda_1.curry(function (type, src) {
    logger_1.logger.info('resizePhoto: [%s] %s', type, src);
    return img_resize_1.imgResize(helpers_1.getSizeStr(type), helpers_1.cachePath(type, src), src);
});
exports.generateMissingFile = ramda_1.curry(function (type, src) {
    logger_1.logger.info('generateMissingFile: [%s] %s', type, src);
    return helpers_1.cachedCopyExists(type, src).chainRej(exports.resizePhoto(type));
});
exports.processFile = function (src) {
    logger_1.logger.info('processFile: %s', src);
    return Future.parallel(2, [
        exports.generateMissingFile('thumb', src),
        exports.generateMissingFile('preview', src)
    ]);
};
exports.readDirRecursively = ramda_1.compose((function (x) { return baconjs_1.fromEvent(x, 'file'); }), fsReaddir);
exports.onFileChanged = ramda_1.curry(function (watchedDir, event, fileName) {
    logger_1.logger.info('The content of [ %s ] dir has been changes', watchedDir);
    logger_1.logger.info('- event: %s\n- fileName: %s', JSON.stringify(event), fileName);
    return exports.processFile(path.join(watchedDir, fileName));
});
exports.watchDir = function (dirName) {
    return fs.watch(dirName, { encoding: 'utf-8', recursive: true }, function (evt, fileName) { return exports.onFileChanged(dirName, evt, fileName).fork(logger_1.logger.error, logger_1.logger.info); });
};
exports.unwatchDir = function (watcher) { return watcher.close(); };
exports.unwatchDirs = ramda_1.map(exports.unwatchDir);
exports.watchDirs = ramda_1.map(exports.watchDir);
