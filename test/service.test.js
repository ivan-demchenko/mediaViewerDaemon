var assert = require('chai').assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('Service functions', () => {

  let Service;

  before(() => {
    Service = proxyquire('../lib/service', {
      './img-resize': require('./mocks/img-resize'),
      './logger': require('./mocks/logger'),
      './helpers': require('./mocks/helpers')
    });
  });

  describe('processFile', () => {

    it('should return Promise(0) if file was processed successfully', done => {
      Service.processFile('thumb', 'a.jpg').fork(
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
          assert.isArray(res, 'The result is an Array');
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

});
