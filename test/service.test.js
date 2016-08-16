var assert = require('chai').assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('Service functions', () => {

  let Service;

  before(() => {
    Service = proxyquire('../lib/service', {
      './img-resize': require('./mocks/img-resize'),
      './logger': require('./mocks/logger')
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

});
