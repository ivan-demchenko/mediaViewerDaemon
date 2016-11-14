var assert = require('chai').assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('Helper functions', () => {

  let H;

  before(() => {
    H = proxyquire('../lib/helpers', {
      'fs': require('./mocks/fs'),
      '../config/user-config.json': require('./mocks/user_config.json')
    });
  });

  describe('cachedCopyExists', () => {

    it('should return file name for non existing file', done => {
      H.cachedCopyExists('img', 'nonexisting').fork(
        er => {},
        x => {
          assert(x === 'nonexisting');
          done();
        }
      )
    });

    it('should return file name for existing file', done => {
      H.cachedCopyExists('type', 'existing').fork(
        done,
        sr => {
          assert(sr === 'existing');
          done();
        }
      )
    });

  });

  describe('isPhoto', () => {

    it('should return True is file name is a file name of a photo', () => {
      assert.equal(H.isPhoto('a.jpg'), true);
      assert.equal(H.isPhoto('a.jpeg'), true);
      assert.equal(H.isPhoto('a.png'), false);
    });

  });

  describe('getSizeStr', () => {

    it('should return proper size having just type', () => {
      assert.equal(H.getSizeStr('thumb'), '100x100');
      assert.equal(H.getSizeStr('preview'), '1000x1000');
    });

  });

  describe('valueDefined', () => {

    it('should return False when undefined or null is passed', () => {
      assert.equal(H.valueDefined(undefined), false);
      assert.equal(H.valueDefined(null), false);
    });

    it('should return False when nothing has been passed', () => {
      assert.equal(H.valueDefined(), false);
    });

    it('should return True for empty string/array/object', () => {
      assert.equal(H.valueDefined(""), true);
      assert.equal(H.valueDefined([]), true);
      assert.equal(H.valueDefined({}), true);
    });

  });

  describe('cachePath', () => {

    it('should return proper path using user_config', () => {
      assert.equal(H.cachePath('a', 'b'), '/test_config_home/a/b')
    });

  });

});
