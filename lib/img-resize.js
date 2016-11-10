///<reference path="../typings/index.d.ts"/>
"use strict";
var Future = require("fluture");
var child_process_1 = require("child_process");
var path = require("path");
var ramda_1 = require("ramda");
var logger_1 = require("./logger");
exports.imgResize = ramda_1.curry(function (size, dst, src) {
    return Future(function (rej, res) {
        logger_1.logger.info('Resize image: %s > %s', src, dst);
        var dstPath = path.dirname(dst);
        var convertProcess = child_process_1.spawn(path.join(__dirname, 'img.sh'), [
            "--src-file=" + src,
            "--dst-file=" + dst,
            "--dst-path=" + dstPath,
            "--new-size=" + size
        ]);
        convertProcess.stdout.on('data', function (data) { return logger_1.logger.info('>> stdout: %s', data); });
        convertProcess.stderr.on('data', function (data) {
            logger_1.logger.info('>> stderr: %s', data);
            rej('' + data);
        });
        convertProcess.on('close', function (code) {
            logger_1.logger.info('Process exited with code %s', code);
            res('done: ' + code);
        });
    });
});
