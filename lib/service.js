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
var helpers_1 = require('./helpers');
var Future = require('fluture');
var helpers_2 = require('./helpers');
exports.resizePhoto = ramda_1.curry(function (type, src) {
    helpers_1.logInfo('resizePhoto: [%s] %s', type, src);
    return img_resize_1.imgResize(helpers_2.getSizeStr(type), helpers_2.cachePath(type, src), src);
});
exports.generateMissingFile = ramda_1.curry(function (type, src) {
    helpers_1.logInfo('generateMissingFile: [%s] %s', type, src);
    return helpers_2.cachedCopyExists(type, src).chainRej(exports.resizePhoto(type));
});
exports.processFile = function (src) {
    helpers_1.logInfo('processFile: %s', src);
    return Future.parallel(2, [exports.generateMissingFile('thumb', src),
        exports.generateMissingFile('preview', src)
    ]);
};
exports.readDirRecursively = ramda_1.compose((function (stream) { return baconjs_1.fromEvent(stream, 'file'); }), fsReaddir);
exports.onFileChanged = ramda_1.curry(function (watchedDir, event, fileName) {
    helpers_1.logInfo('The content of dir [ %s ] has been changes', watchedDir);
    helpers_1.logInfo('- event: %s\n- fileName: %s', JSON.stringify(event), fileName);
    return exports.processFile(path.join(watchedDir, fileName));
});
exports.watchDir = function (dirName) {
    return fs.watch(dirName, { encoding: 'utf-8', recursive: true }, function (evt, fileName) {
        return exports.onFileChanged(dirName, evt, fileName).fork(helpers_1.logError('Error processing file on change'), helpers_1.logInfo('File has been processed'));
    });
};
exports.unwatchDir = function (watcher) { return watcher.close(); };
exports.unwatchDirs = ramda_1.map(exports.unwatchDir);
exports.watchDirs = ramda_1.map(exports.watchDir);
