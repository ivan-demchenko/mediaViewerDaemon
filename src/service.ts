import * as rread from 'readdir-recursive';
import { curry, compose, map, filter, allPass, flatten, CurriedFunction2, CurriedFunction3 } from 'ramda';
import * as path from 'path';
import * as fs from 'fs';
import { imgResize } from './img-resize';
import { logger } from './logger';
import * as Future from 'fluture';

import { valueDefined, cachePath, cachedCopyExists, getSizeStr, isPhoto, nonDotFile } from './helpers';

//    resizePhoto :: String -> String -> Promise(OperationResult)
export const resizePhoto:CurriedFunction2<string, string, Future> =
curry((type:string, src:string):Future => {
  logger.info('resizePhoto: [%s] %s', type, src);
  let dst = cachePath(type, src);
  return imgResize(getSizeStr(type), dst, src);
});

//    (String -> Future(OperationResult)) -> String -> String -> Future(OperationResult)
export const generateMissingFile:CurriedFunction2<string, string, Future> =
curry((type:string, src:string):Future => {
  logger.info('generateMissingFile: [%s] %s', type, src);
  return cachedCopyExists(type, src).chainRej(resizePhoto(type));
});

export const processFile = (src:string):Future => {
  logger.info('processFile: %s', src);
  return Future.parallel(2, [
    generateMissingFile('thumb', src),
    generateMissingFile('preview', src)
  ]);
};

export const processFiles:([string]) => Future =
compose(
  map(processFile),
  filter(allPass([nonDotFile, isPhoto])),
  flatten,
  map(rread.fileSync)
);

export const onFileChanged:CurriedFunction3<string, string, string, Future> =
curry((watchedDir:string, event:string, fileName:string):Future => {
  logger.info('The content of [ %s ] dir has been changes', watchedDir);
  logger.info('- event: %s\n- fileName: %s', JSON.stringify(event), fileName);
  return processFile(path.join(watchedDir, fileName));
});

export const startWatching = (dirName: string):fs.FSWatcher =>
  fs.watch(dirName, { encoding: 'utf-8', recursive: true },
    (evt, fileName:string) => onFileChanged(dirName, evt, fileName).fork(logger.error, logger.info)
  );

export const watchDirs = map(startWatching);
