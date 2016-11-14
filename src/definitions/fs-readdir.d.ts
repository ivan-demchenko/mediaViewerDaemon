///<reference path="../../typings/index.d.ts" />

declare module 'fs-readdir' {

var fsReaddir:FSReaddir;

interface FSReaddir {
    (path:string): NodeJS.EventEmitter
}

export = fsReaddir;

}