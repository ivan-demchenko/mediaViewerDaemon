/// <reference path="../typings/index.d.ts" />
/// <reference path="./definitions/index.d.ts" />

const config = require('../config/file-conversion.json');
const userConfig = require('../config/user-config.json');
import { FileType, FormattedImgSize, FileName, FileSrc, FileDest, SrcDir } from './interfaces';
import { compose, not, isNil, curryN, curry, length, match, lt, equals, always, CurriedFunction2 } from 'ramda';
import { logger } from './logger';
import * as Future from 'fluture';
import * as fs  from 'fs';
import * as path from 'path';

export const logInfo = curryN(2, logger.info);
export const logError = curryN(2, logger.error);

export const cachePath:CurriedFunction2<FileType, FileSrc, FileDest> =
  curryN(3, path.join)(userConfig.outputDir);


export const valueDefined:(any) => boolean =
  compose(not, isNil);


export const cachedCopyExists:CurriedFunction2<FileType, FileSrc, Future<FileSrc, FileSrc>> = 
curry((type:FileType, src:FileSrc):Future<FileSrc, FileSrc> => {
  const cacheFilePath = cachePath(type, src);
  logInfo('cachedCopyExists: ' + cacheFilePath);
  return Future.node(done =>
    fs.access(cacheFilePath, fs.constants.F_OK, done)
  ).bimap(always(src), always(src))
});


export const getSizeStr = (type:FileType):FormattedImgSize =>
  <FormattedImgSize>`${config.photos[type].w}x${config.photos[type].h}`;


export const isPhoto:(name:FileSrc) => boolean =
  compose(lt(0), length, match(new RegExp('\.(jpeg|jpg)$')));