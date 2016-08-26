//
// lib/img-resize
//
"use strict";
const Future = require('fluture');
const spawn = require('child_process').spawn;
const path = require('path');
const R = require('ramda');
const logger = require('./logger');

module.exports = R.curry((size, dst, src) => {
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
