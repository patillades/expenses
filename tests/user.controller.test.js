const expect = require('expect');

const testUtils = require('./testUtils');

describe('User controller', function () {
  let testUser;
  let mail;
  let password;

  before(() => {
    testUser = {
      name: 'patxi',
      mail: `test_${Date.now()}@mail.com`,
      password: 'someEasyPw',
    };

    ({ mail, password } = testUser);
  });

  describe('create', function () {
    it('should return 400 and an error msg if missing params', done => {
      testUtils.request('POST', '/users', {}, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('required');

        done();
      });
    });

    it('should return 201 and the user if it worked', done => {
      testUtils.request('POST', '/users', testUser, (status, body) => {
        expect(status).toBe(201);
        expect(body.name).toBe(testUser.name);
        expect(body.mail).toBe(testUser.mail);

        done();
      });
    });

    it('should return 400 if mail already exists', done => {
      testUtils.request('POST', '/users', testUser, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('already registered');

        done();
      });
    });
  });

  describe('login', function () {
    it('should return 201 if it worked', done => {
      testUtils.request('POST', '/users/login', { mail, password }, (status, body) => {
        expect(status).toBe(201);
        expect(body.token).toBeA('string');

        done();
      })
    });

    it('should return 400 if password is wrong', done => {
      testUtils.request('POST', '/users/login', { mail, password: 'wrong' }, status => {
        expect(status).toBe(400);

        done();
      })
    });

    it('should return 400 if mail is wrong', done => {
      testUtils.request('POST', '/users/login', { mail: 'notamail', password }, status => {
        expect(status).toBe(400);

        done();
      })
    });

    it('should return 400 if missing params', done => {
      testUtils.request('POST', '/users/login', {}, status => {
        expect(status).toBe(400);

        done();
      })
    });
  });
});
