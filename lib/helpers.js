///<reference path="../typings/index.d.ts"/>
"use strict";
var config = require('./config.json');
var userConfig = require('../user_config.json');
var ramda_1 = require("ramda");
var Future = require("fluture");
var fs = require("fs");
var path = require("path");
// cachePath :: string -> string -> string -> string
exports.cachePath = ramda_1.curryN(3, path.join)(userConfig.outputDir);
// valueDefined :: * -> bool
exports.valueDefined = ramda_1.compose(ramda_1.not, ramda_1.isNil);
// cachedCopyExists :: String -> String -> Promise(String)
exports.cachedCopyExists = ramda_1.curry(function (type, src) {
    return Future.node(function (done) {
        return fs.access(exports.cachePath(type, src), fs.constants.F_OK, done);
    }).bimap(ramda_1.always(src), ramda_1.always(src));
});
// getSizeStr :: string -> string
exports.getSizeStr = function (type) {
    return config.photos[type].w + "x" + config.photos[type].h;
};
// isPhoto :: string -> bool
exports.isPhoto = ramda_1.compose(ramda_1.lt(0), ramda_1.length, ramda_1.match(new RegExp('\.(jpeg|jpg)$')));
// nonDotFile :: string -> bool
exports.nonDotFile = ramda_1.compose(ramda_1.equals(0), ramda_1.length, ramda_1.match(new RegExp('^\.')));
