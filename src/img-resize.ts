///<reference path="../typings/index.d.ts"/>

import { FileType, FormattedImgSize, FileName, FileSrc, FileDest, SrcDir } from './interfaces';
import * as Future from 'fluture';
import { spawn } from 'child_process';
import * as path from 'path';
import { curry, CurriedFunction3 } from 'ramda';
import { logInfo } from './helpers';

export const imgResize:CurriedFunction3<FormattedImgSize, FileDest, FileSrc, Future<string, string>> =
curry((imgSize:FormattedImgSize, dst:FileDest, src:FileSrc):Future<string, string> => {
  return Future((rej, res) => {
    var dstPath = path.dirname(dst);
    logInfo('Resize image: src: %s\ndst:%s\ndstPath:%s\nsize: %s', src, dst, dstPath, imgSize);
    var convertProcess = spawn(path.join(__dirname, '..', 'bin/img.sh'), [
      `--src-file=${src}`,
      `--dst-file=${dst}`,
      `--dst-path=${dstPath}`,
      `--new-size=${imgSize}`
    ]);

    convertProcess.stdout.on('data', data => 
      logInfo('>> stdout: %s', data.toString())
    );

    convertProcess.stderr.on('data', data => {
      logInfo('>> stderr: %s', data.toString());
      rej(data.toString());
    });

    convertProcess.on('close', code => {
      logInfo('Process exited with code %s', code.toString());
      res('done: ' + code.toString());
    });

  });
});
