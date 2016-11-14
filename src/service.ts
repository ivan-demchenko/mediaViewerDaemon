/// <reference path="../typings/index.d.ts" />
/// <reference path="./definitions/index.d.ts" />
/// <reference path="./interfaces.ts" />

import { FileType, FileName, FileSrc, FileDest, SrcDir } from './interfaces';
import * as fsReaddir from 'fs-readdir';
import { fromEvent, EventStream } from 'baconjs'
import { flip, curry, curryN, compose, map, filter, allPass, flatten, CurriedFunction2, CurriedFunction3 } from 'ramda';
import * as path from 'path';
import * as fs from 'fs';
import { imgResize } from './img-resize';
import { logger } from './logger';
import * as Future from 'fluture';

import { valueDefined, cachePath, cachedCopyExists, getSizeStr, isPhoto, nonDotFile } from './helpers';

export const resizePhoto:CurriedFunction2<FileType, FileSrc, Future<string, string>> =
curry((type:FileType, src:FileSrc):Future<string, string> => {
  logger.info('resizePhoto: [%s] %s', type, src);
  return imgResize(getSizeStr(type), cachePath(type, src), src);
});

export const generateMissingFile:CurriedFunction2<FileType, FileSrc, Future<string, FileSrc>> =
curry((type:FileType, src:FileSrc):Future<string, FileSrc> => {
  logger.info('generateMissingFile: [%s] %s', type, src); 
  return cachedCopyExists(type, src).chainRej(resizePhoto(type));
});

export const processFile = (src:FileSrc):Future<string, FileSrc[]> => {
  logger.info('processFile: %s', src);
  return Future.parallel(2, [
    generateMissingFile(<FileType>'thumb', src),
    generateMissingFile(<FileType>'preview', src)
  ]);
};

export const readDirRecursively = compose(
  (x => fromEvent(x, 'file')),
  fsReaddir
)

export const onFileChanged:CurriedFunction3<SrcDir, string, string, Future<string, FileSrc[]>> =
curry((watchedDir:SrcDir, event:any, fileName:FileSrc) => {
  logger.info('The content of [ %s ] dir has been changes', watchedDir);
  logger.info('- event: %s\n- fileName: %s', JSON.stringify(event), fileName);
  return processFile(<FileSrc>path.join(watchedDir, fileName));
});

export const watchDir = (dirName: SrcDir):fs.FSWatcher =>
  fs.watch(dirName, { encoding: 'utf-8', recursive: true },
    (evt, fileName:string) => onFileChanged(dirName, evt, fileName).fork(logger.error, logger.info)
  );

export const unwatchDir = (watcher: fs.FSWatcher) => watcher.close()

export const unwatchDirs = map(unwatchDir);

export const watchDirs = map(watchDir);
