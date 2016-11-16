/// <reference path="../typings/index.d.ts" />
/// <reference path="./definitions/index.d.ts" />
"use strict";
var ramda_1 = require('ramda');
var service_1 = require('./service');
var baconjs_1 = require('baconjs');
var helpers_1 = require('./helpers');
var logger_1 = require('./logger');
var userConfig = require('../config/user-config.json');
var fromFuture = function (future) {
    return Bacon.fromBinder(function (sink) {
        future.bimap(function (err) { return new Bacon.Error(err); }, function (res) { return new Bacon.Next(res); });
        return function () { };
    });
};
var sigterm = baconjs_1.fromEvent(process, 'SIGTERM')
    .doAction(function (x) { return logger_1.logger.info('SIGTERM: stopping the process'); });
var filesToProcess = baconjs_1.fromArray(userConfig.srcPaths)
    .flatMap(service_1.readDirRecursively).filter(helpers_1.isPhoto);
var dirsToWatch = baconjs_1.fromArray(userConfig.srcPaths)
    .doAction(function (x) { return logger_1.logger.log('log', 'watch dir', x); })
    .map(service_1.watchDir)
    .scan([], ramda_1.flip(ramda_1.append))
    .sampledBy(sigterm)
    .onValue(service_1.unwatchDirs);
filesToProcess
    .takeUntil(sigterm)
    .map(service_1.processFile)
    .onValue(function (x) { return x.fork(logger_1.logger.error, logger_1.logger.info); });
