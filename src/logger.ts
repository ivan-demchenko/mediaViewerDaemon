///<reference path="../typings/index.d.ts"/>

import * as path from 'path';
import { Logger, LoggerInstance, transports } from 'winston';

export const logger:LoggerInstance = new Logger({
  transports: [
    new transports.Console(),
    new transports.File({
      name: 'exceptions',
      level: 'exception',
      filename: path.join(__dirname, '../logs/exceptions.log'),
      handleExceptions: true,
      humanReadableUnhandledException: true
    }),
    new transports.File({
      name: 'infos',
      filename: path.join(__dirname, '../logs/infos.log'),
      level: 'info'
    }),
    new transports.File({
      name: 'errors',
      filename: path.join(__dirname, '../logs/errors.log'),
      level: 'error'
    })
  ]
});