var mockery = require('mockery');

mockery.registerSubstitute('fs', require('./mocks/fs'));
mockery.registerSubstitute('./user_config.json', require('./mocks/user_config'));

var Service = require('../lib/service');

describe('Service functions', () => {
  beforeEach(() => mockery.enable());
  afterEach(() => mockery.disable());

  describe('processFile', () => {

    it('should return Promise(0) if file was processed fine', done => {
      Service.processFile('thumb', 'a.jpg').fork(
        done,
        res => {
          expect(res).toBe(0);
          done();
        }
      )
    });

  });

});
