///<reference path="../typings/index.d.ts"/>

const config = require('./config.json');
const userConfig = require('../user_config.json');  
import { compose, not, isNil, curryN, curry, length, match, lt, equals, always, CurriedFunction2 } from 'ramda';
import * as Future from 'fluture';
import * as fs  from 'fs';
import * as path from 'path';

// cachePath :: string -> string -> string -> string
export const cachePath:CurriedFunction2<string, string, string> =
  curryN(3, path.join)(userConfig.outputDir);

// valueDefined :: * -> bool
export const valueDefined:(any) => boolean =
  compose(not, isNil);

// cachedCopyExists :: String -> String -> Promise(String)
export const cachedCopyExists:CurriedFunction2<string, string, Future> = 
curry((type:string, src:string):Future =>
  Future.node(done =>
    fs.access(cachePath(type, src), fs.constants.F_OK, done)
  ).bimap(always(src), always(src))
);

// getSizeStr :: string -> string
export const getSizeStr = (type:string) =>
  `${config.photos[type].w}x${config.photos[type].h}`;

// isPhoto :: string -> bool
export const isPhoto:(name:string) => boolean =
  compose(lt(0), length, match(new RegExp('\.(jpeg|jpg)$')));

// nonDotFile :: string -> bool
export const nonDotFile:(name:string) => boolean =
  compose(equals(0), length, match(new RegExp('^\.')));
