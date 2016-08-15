var assert = require('chai').assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('Helper functions', () => {

  let H;

  before(() => {
    H = proxyquire('../lib/helpers', {
      'fs': require('./mocks/fs')
    });
  });

  describe('cachedCopyExists', () => {

    it('should return False if the file does not exists', done => {
      H.cachedCopyExists('error', 'path').fork(
        errorRes => {
          assert.equal(errorRes, false);
          done();
        },
        done
      )
    });

    it('should return True if the file does exists', done => {
      H.cachedCopyExists('any', 'other').fork(
        done,
        successRes => {
          assert.equal(successRes, true);
          done();
        }
      )
    });

  });

  describe('nonDotFile', () => {

    it('should return True for non dot file', () => {
      assert.equal(H.nonDotFile('filename.txt'), true);
    });

    it('should return False for a dot-file', () => {
      assert.equal(H.nonDotFile('.filename'), false);
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
      assert.equal(H.cachePath('a', 'b'), '/home/a/b')
    });

  });

});
