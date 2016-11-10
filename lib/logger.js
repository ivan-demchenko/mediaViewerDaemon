///<reference path="../typings/index.d.ts"/>
"use strict";
var path = require("path");
var winston_1 = require("winston");
exports.logger = new winston_1.Logger({
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({
            name: 'exceptions',
            level: 'exception',
            filename: path.join(__dirname, '../logs/exceptions.log'),
            handleExceptions: true,
            humanReadableUnhandledException: true
        }),
        new winston_1.transports.File({
            name: 'infos',
            filename: path.join(__dirname, '../logs/infos.log'),
            level: 'info'
        }),
        new winston_1.transports.File({
            name: 'errors',
            filename: path.join(__dirname, '../logs/errors.log'),
            level: 'error'
        })
    ]
});
