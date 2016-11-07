const expect = require('expect');

const testUtils = require('./testUtils');

describe('Expense controller', function () {
  let testUser;
  let id;
  let token;

  before(done => {
    testUser = testUtils.getTestUser();

    testUtils.request('POST', '/api/users', testUser, (status, body) => {
      expect(status).toBe(201);

      ({ id, token } = body );

      done();
    });
  });

  describe('JWT access', function () {
    it('should return 401 if no Authorization header', done => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {}, status => {
        expect(status).toBe(401);

        done();
      });
    });

    it('should return 401 if Authorization header has wrong scheme', done => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {}, status => {
        expect(status).toBe(401);

        done();
      }, { Authorization: 'someauth' });
    });

    it('should return 401 if Authorization header has wrong scheme', done => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {}, status => {
        expect(status).toBe(401);

        done();
      }, { Authorization: 'token token' });
    });

    it('should return 401 if Authorization header has wrong token', done => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {}, status => {
        expect(status).toBe(401);

        done();
      }, { Authorization: 'Bearer token' });
    });

    it('should return 401 if the token subject does not match the user id', done => {
      testUtils.request('POST', `/api/users/notanid/expenses`, {}, status => {
        expect(status).toBe(401);

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 400 if Authorization header is ok but missing params', done => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {}, status => {
        expect(status).toBe(400);

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 400 if Authorization header is ok but amount is not number', done => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {
        amount: 'notnumber',
        description: 'some stuff',
        date: Date.now()
      }, status => {
        expect(status).toBe(400);

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 400 if Authorization header is ok but date is not a date', done => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {
        amount: 20,
        description: 'some stuff',
        date: 'yesterday'
      }, status => {
        expect(status).toBe(400);

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 201 if everything ok', done => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {
        amount: 20,
        description: 'some stuff',
        date: Date.now()
      }, (status, body) => {
        expect(status).toBe(201);
        expect(body).toExcludeKey('comment');

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 201 and comment if everything ok', done => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {
        amount: 20,
        description: 'some stuff',
        date: Date.now(),
        comment: 'cool!'
      }, (status, body) => {
        expect(status).toBe(201);
        expect(body).toIncludeKey('comment');

        done();
      }, { Authorization: `Bearer ${token}` });
    });
  });
});