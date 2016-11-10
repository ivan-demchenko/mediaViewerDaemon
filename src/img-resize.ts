///<reference path="../typings/index.d.ts"/>

import * as Future from 'fluture';
import { spawn } from 'child_process';
import * as path from 'path';
import { curry } from 'ramda';
import { logger } from './logger';

export const imgResize:Future = curry((size:string, dst:string, src:string) => {
  return Future((rej, res) => {
    logger.info('Resize image: %s > %s', src, dst);
    var dstPath = path.dirname(dst);
    var convertProcess = spawn(path.join(__dirname, 'img.sh'), [
      `--src-file=${src}`,
      `--dst-file=${dst}`,
      `--dst-path=${dstPath}`,
      `--new-size=${size}`
    ]);

    convertProcess.stdout.on('data', data => logger.info('>> stdout: %s', data));

    convertProcess.stderr.on('data', data => {
      logger.info('>> stderr: %s', data);
      rej('' + data);
    });

    convertProcess.on('close', code => {
      logger.info('Process exited with code %s', code);
      res('done: ' + code);
    });

  });
});
