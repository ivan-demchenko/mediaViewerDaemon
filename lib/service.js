"use strict";
var rread = require("readdir-recursive");
var ramda_1 = require("ramda");
var path = require("path");
var fs = require("fs");
var img_resize_1 = require("./img-resize");
var logger_1 = require("./logger");
var Future = require("fluture");
var helpers_1 = require("./helpers");
//    resizePhoto :: String -> String -> Promise(OperationResult)
exports.resizePhoto = ramda_1.curry(function (type, src) {
    logger_1.logger.info('resizePhoto: [%s] %s', type, src);
    var dst = helpers_1.cachePath(type, src);
    return img_resize_1.imgResize(helpers_1.getSizeStr(type), dst, src);
});
//    (String -> Future(OperationResult)) -> String -> String -> Future(OperationResult)
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
exports.processFiles = ramda_1.compose(ramda_1.map(exports.processFile), ramda_1.filter(ramda_1.allPass([helpers_1.nonDotFile, helpers_1.isPhoto])), ramda_1.flatten, ramda_1.map(rread.fileSync));
exports.onFileChanged = ramda_1.curry(function (watchedDir, event, fileName) {
    logger_1.logger.info('The content of [ %s ] dir has been changes', watchedDir);
    logger_1.logger.info('- event: %s\n- fileName: %s', JSON.stringify(event), fileName);
    return exports.processFile(path.join(watchedDir, fileName));
});
exports.startWatching = function (dirName) {
    return fs.watch(dirName, { encoding: 'utf-8', recursive: true }, function (evt, fileName) { return exports.onFileChanged(dirName, evt, fileName).fork(logger_1.logger.error, logger_1.logger.info); });
};
exports.watchDirs = ramda_1.map(exports.startWatching);
