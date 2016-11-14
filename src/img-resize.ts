///<reference path="../typings/index.d.ts"/>

import { FileType, FormattedImgSize, FileName, FileSrc, FileDest, SrcDir } from './interfaces';
import * as Future from 'fluture';
import { spawn } from 'child_process';
import * as path from 'path';
import { curry, CurriedFunction3 } from 'ramda';
import { logger } from './logger';

export const imgResize:CurriedFunction3<FormattedImgSize, FileDest, FileSrc, Future<string, string>> =
curry((imgSize:FormattedImgSize, dst:FileDest, src:FileSrc):Future<string, string> => {
  return Future((rej, res) => {
    var dstPath = path.dirname(dst);
    logger.info('Resize image: src: %s\ndst:%s\ndstPath:%s\nsize: %s', src, dst, dstPath, imgSize);
    var convertProcess = spawn(path.join(__dirname, '..', 'sh/img.sh'), [
      `--src-file=${src}`,
      `--dst-file=${dst}`,
      `--dst-path=${dstPath}`,
      `--new-size=${imgSize}`
    ]);

    convertProcess.stdout.on('data', data => 
      logger.info('>> stdout: %s', data)
    );

    convertProcess.stderr.on('data', data => {
      logger.info('>> stderr: %s', data);
      rej(data);
    });

    convertProcess.on('close', code => {
      logger.info('Process exited with code %s', code);
      res('done: ' + code);
    });

  });
});
