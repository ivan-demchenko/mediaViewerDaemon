var assert = require('chai').assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var Future = require('fluture');

describe('Service functions', () => {

  let Service;

  before(() => {
    Service = proxyquire('../lib/service', {
      './img-resize': require('./mocks/img-resize'),
      './logger': require('./mocks/logger'),
      './helpers': require('./mocks/helpers')
    });
  });

  describe('resizePhoto', () => {

    it('should return Future(_, 0) if file was processed successfully', done => {
      Service.resizePhoto('thumb', 'a.jpg').fork(
        done,
        res => {
          assert.equal(res, 0);
          done();
        }
      )
    });

  });

  describe('onFileChanged', () => {

    it('should return a Future', () => {
      let future = Service.onFileChanged('/home/', {}, 'a.jpg');
      assert(Future.isFuture(future) === true, 'x should be a Future');
    });

    it('should return Future([Bool, Bool]) denoting existing files', done => {
      Service.onFileChanged('/home/', {}, 'a.jpg').fork(
        err => done(err),
        res => {
          assert(res[0] === true, 'Thumb exists');
          assert(res[1] === true, 'Preview exists');
          done();
        }
      );
    });

  })

});
