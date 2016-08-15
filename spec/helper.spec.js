const mock = require('mock-require');
var H;

describe('Helper functions', () => {

  beforeEach(() => {
    mock('fs', require('./mocks/fs'))
    H = require('../lib/helpers');
  });

  afterEach(() => mock.stop('fs'));

  describe('nonDotFile', () => {

    it('should return True if is a file name of a dot-file', () => {
      expect(H.nonDotFile('.filename')).toBe(false);
      expect(H.nonDotFile('filename.txt')).toBe(true);
    });

  });

  describe('isPhoto', () => {

    it('should return True is file name is a file name of a photo', () => {
      expect(H.isPhoto('a.jpg')).toBe(true);
      expect(H.isPhoto('a.jpeg')).toBe(true);
      expect(H.isPhoto('a.png')).toBe(false);
    });

  });

  describe('getSizeStr', () => {

    it('should return proper size having just type', () => {
      expect(H.getSizeStr('thumb')).toBe('100x100');
      expect(H.getSizeStr('preview')).toBe('1000x1000');
    });

  });

  describe('valueDefined', () => {

    it('should return False when undefined or null is passed', () => {
      expect(H.valueDefined(undefined)).toBe(false);
      expect(H.valueDefined(null)).toBe(false);
    });

    it('should return False when nothing has been passed', () => {
      expect(H.valueDefined()).toBe(false);
    });

    it('should return True for empty string/array/object', () => {
      expect(H.valueDefined("")).toBe(true);
      expect(H.valueDefined([])).toBe(true);
      expect(H.valueDefined({})).toBe(true);
    });

  });

  describe('cachePath', () => {

    it('should return proper path using user_config', () => {
      expect(H.cachePath('a', 'b')).toBe('/home/a/b')
    });

  });

  describe('cachedCopyExists', () => {

    it('should return False if the file does not exists', done => {
      H.cachedCopyExists('error', 'path').fork(
        errorRes => {
          expect(errorRes).toBe(false);
          done();
        },
        done
      )
    });

    it('should return True if the file does exists', done => {
      H.cachedCopyExists('any', 'other').fork(
        done,
        successRes => {
          expect(successRes).toBe(true);
          done();
        }
      )
    });

  });

});
