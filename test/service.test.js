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

    it('should return Promise(0) if file was processed successfully', done => {
      Service.resizePhoto('thumb', 'a.jpg').fork(
        done,
        res => {
          assert.equal(res, 0);
          done();
        }
      )
    });

  });

  describe('findMissingCacheItems', () => {

    it('should return Promise([]) as both thumb and preview are missing for a.jpg', done => {
      Service.findMissingCacheItems('a.jpg').fork(
        res => {
          assert(res.length === 0, 'The result is an empty Array');
          done();
        },
        done
      )
    });

    it('should return Promise([thumb, preview]) for b.jpg', done => {
      Service.findMissingCacheItems('b.jpg').fork(
        done,
        res => {
          assert(res.toString() == ['thumb', 'preview'].toString());
          done();
        }
      )
    });

  })

  describe('onFileChanged', () => {

    it('should return an Array of Futures', () => {
      let x = Service.onFileChanged('/home/', Service.resizePhoto, {}, 'a.jpg');
      assert(Array.isArray(x), 'it should be an Array');
    });

    it('should return an Array(Future(Int))', (done) => {
      Future.parallel(1, Service.onFileChanged('/home/', Service.resizePhoto, {}, 'a.jpg')).fork(
        err => done(),
        succ => {
          assert(succ[0] === 0, 'The first one is 0');
          assert(succ[1] === 0, 'The first one is 0');
          done();
        }
      );
    });

  })

});
