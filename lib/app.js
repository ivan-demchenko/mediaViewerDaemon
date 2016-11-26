/// <reference path="../typings/index.d.ts" />
/// <reference path="./definitions/index.d.ts" />
/// <reference path="./interfaces.ts" />
"use strict";
var ramda_1 = require('ramda');
var service_1 = require('./service');
var baconjs_1 = require('baconjs');
var helpers_1 = require('./helpers');
var userConfig = require('../config/user-config.json');
var futureToStream = function (future) {
    return baconjs_1.fromBinder(function (sink) {
        future.fork(function (err) {
            sink(new baconjs_1.Error(err));
            sink(new baconjs_1.End());
        }, function (res) {
            sink(new baconjs_1.Next(res));
            sink(new baconjs_1.End());
        });
        return function () { };
    });
};
var sigterm = baconjs_1.fromEvent(process, 'SIGTERM')
    .doAction(helpers_1.logInfo('SIGTERM: stopping the process'));
var filesToProcess = baconjs_1.fromArray(userConfig.srcPaths)
    .flatMap(service_1.readDirRecursively).filter(helpers_1.isPhoto);
var dirsToWatch = baconjs_1.fromArray(userConfig.srcPaths)
    .doAction(helpers_1.logInfo('watch dir'))
    .map(service_1.watchDir)
    .scan([], ramda_1.flip(ramda_1.append))
    .sampledBy(sigterm)
    .onValue(service_1.unwatchDirs);
var x = filesToProcess
    .takeUntil(sigterm)
    .map(service_1.processFile)
    .flatMapWithConcurrencyLimit(1, futureToStream)
    .onValue(helpers_1.logInfo('processing result'));
