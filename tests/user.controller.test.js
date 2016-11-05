const expect = require('expect');

const testUtils = require('./testUtils');

describe('User controller', function () {
  describe('createUser', function () {
    let testUser;

    before(() => {
      testUser = {
        name: 'patxi',
        mail: `test_${Date.now()}@mail.com`,
        password: 'someEasyPw',
      }
    });

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
});
