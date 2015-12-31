//
// lib/logger.js
//
"use strict";

const path = require('path');
const winston = require('winston');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      name: 'exceptions',
      filename: path.join(__dirname, '../logs/exceptions.log'),
      handleExceptions: true,
      humanReadableUnhandledException: true
    }),
    new winston.transports.File({
      name: 'infos',
      filename: path.join(__dirname, '../logs/infos.log'),
      level: 'info'
    }),
    new winston.transports.File({
      name: 'errors',
      filename: path.join(__dirname, '../logs/errors.log'),
      level: 'error'
    })
  ]
});

module.exports = logger;
