const expect = require('expect');

const testUtils = require('./testUtils');

describe('Expense controller', function () {
  let testUser;
  let id;
  let token;

  before(done => {
    testUser = testUtils.getTestUser();

    testUtils.request('POST', '/users', testUser, (status, body) => {
      expect(status).toBe(201);

      ({ id, token } = body );

      done();
    });
  });

  describe('JWT access', function () {
    it('should return 401 if no Authorization header', done => {
      testUtils.request('POST', `/users/${id}/expenses`, {}, status => {
        expect(status).toBe(401);

        done();
      });
    });

    it('should return 401 if Authorization header has wrong scheme', done => {
      testUtils.request('POST', `/users/${id}/expenses`, {}, status => {
        expect(status).toBe(401);

        done();
      }, { Authorization: 'someauth' });
    });

    it('should return 401 if Authorization header has wrong scheme', done => {
      testUtils.request('POST', `/users/${id}/expenses`, {}, status => {
        expect(status).toBe(401);

        done();
      }, { Authorization: 'token token' });
    });

    it('should return 401 if Authorization header has wrong token', done => {
      testUtils.request('POST', `/users/${id}/expenses`, {}, status => {
        expect(status).toBe(401);

        done();
      }, { Authorization: 'Bearer token' });
    });

    it('should go through if Authorization header is ok', done => {
      testUtils.request('POST', `/users/${id}/expenses`, {}, (status, body) => {
        expect(status).toBe(201);

        done();
      }, { Authorization: `Bearer ${token}` });
    });
  });
});