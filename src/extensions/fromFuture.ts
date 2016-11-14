/// <reference path="../../typings/index.d.ts" />
/// <reference path="../definitions/index.d.ts" />

import Future from 'fluture';
import Bacon from 'baconjs';

function valueAndEnd(value) {
  return [value, new Bacon.End()];
}

Bacon.fromFuture = (future:Future<any, any>, eventTransformer) =>
    Bacon.fromBinder(handler => {
        future.bimap(e => handler(new Error(e)), handler);
        return () => {};
    });
