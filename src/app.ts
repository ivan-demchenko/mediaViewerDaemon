///<reference path="../typings/index.d.ts"/>

import { of } from 'most';


of([1,2,3]).subscribe(console.log.bind(console));

const userConfig = require('../user_config.json');

// const compose = require('ramda/src/compose');
// const logger = require('./logger');
// const Future = require('fluture');
//
// const { processFiles, watchDirs } = require('./service');
//
// var app = compose(Future.parallel(1), processFiles);
//
// app(userConfig.srcPaths).fork(
//   logger.error,
//   logger.info
// )
//
// var watchers = watchDirs(userConfig.srcPaths);
//
// process.on('SIGTERM', () => {
//   logger.info('SIGTERM : Stopping the process');
//   R.forEach(R.invoker(0, 'close'), watchers);
//   watchers = [];
// });
