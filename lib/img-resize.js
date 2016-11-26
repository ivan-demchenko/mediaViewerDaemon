///<reference path="../typings/index.d.ts"/>
"use strict";
var Future = require('fluture');
var child_process_1 = require('child_process');
var path = require('path');
var ramda_1 = require('ramda');
var helpers_1 = require('./helpers');
exports.imgResize = ramda_1.curry(function (imgSize, dst, src) {
    return Future(function (rej, res) {
        var dstPath = path.dirname(dst);
        helpers_1.logInfo('Resize image: src: %s\ndst:%s\ndstPath:%s\nsize: %s', src, dst, dstPath, imgSize);
        var convertProcess = child_process_1.spawn(path.join(__dirname, '..', 'sh/img.sh'), [
            ("--src-file=" + src),
            ("--dst-file=" + dst),
            ("--dst-path=" + dstPath),
            ("--new-size=" + imgSize)
        ]);
        convertProcess.stdout.on('data', function (data) {
            return helpers_1.logInfo('>> stdout: %s', data);
        });
        convertProcess.stderr.on('data', function (data) {
            helpers_1.logInfo('>> stderr: %s', data);
            rej(data);
        });
        convertProcess.on('close', function (code) {
            helpers_1.logInfo('Process exited with code %s', code);
            res('done: ' + code);
        });
    });
});
