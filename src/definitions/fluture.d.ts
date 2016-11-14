///<reference path="../../typings/index.d.ts" />

declare module 'fluture' {
    
var Future: Future<any, any>

type NodeCallback = (err: NodeJS.ErrnoException) => void;

type FutureNodeCallback = (callback: NodeCallback) => void;

interface Future<L, R> {
    (callback: (reject:(x:L) => void, resolve:(x:R) => void) => void): Future<L, R>
    fork: <L, R>(errorCb:(e:L) => void, successCb:(s:R) => void) => void 
    of<R>(x:R): Future<any, R>
    reject<L>(x:L): Future<L, any>
    chainRej<L, R, C>(cb: (x:L) => Future<L, C>): Future<L, C>
    after<R>(timeout:number, val:R): Future<any, R>
    bimap<E, S>(mapErr:(x:L) => E, mapRes:(x:R) => S): Future<E, S>
    node<L, R>(done: FutureNodeCallback): Future<L, R>
    parallel<L, R>(count: number, xs:Future<L, R>[]): Future<L, R[]>
}

export = Future;

}