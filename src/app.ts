/// <reference path="../typings/index.d.ts" />
/// <reference path="./definitions/index.d.ts" />
/// <reference path="./interfaces.ts" />

import { UserConfig } from './interfaces';
import { compose, map, append, flip, curryN } from 'ramda';
import { readDirRecursively, processFile, watchDir, unwatchDirs } from './service';
import { fromArray, fromBinder, Error, Next, End, EventStream, fromEvent } from 'baconjs'
import { isPhoto, logInfo, logError } from './helpers'
import { logger } from './logger';
import * as Future from 'fluture';
import { FileSrc } from './interfaces';

const userConfig: UserConfig = require('../config/user-config.json');

const futureToStream = <L, R>(future: Future<L, R>): EventStream<L, R> => {
    return fromBinder(sink => {
        future.fork(
            (err:L) => {
                sink(new Error(err));
                sink(new End());
            },
            (res:R) => {
                sink(new Next(res));
                sink(new End());
            }
        );
        return () => { };
    });
};

const sigterm =
    fromEvent(process, 'SIGTERM')
        .doAction(logInfo('SIGTERM: stopping the process'));

const userDirs: EventStream<{}, FileSrc> =
    fromArray(userConfig.srcPaths);

const filesToProcess: EventStream<{}, FileSrc> =
    userDirs.flatMap(readDirRecursively).filter(isPhoto);

const dirsToWatch =
    userDirs.doAction(logInfo('watching: '))
        .map(watchDir)
        .scan([], flip(append))
        .sampledBy(sigterm)
        .onValue(unwatchDirs);

const x = filesToProcess
    .takeUntil(sigterm)
    .map(processFile)
    .flatMapWithConcurrencyLimit<FileSrc[]>(1, futureToStream)
    .onValue(logInfo('processing result'));
