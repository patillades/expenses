// add this file's directory to the node modules search path
require('app-module-path').addPath(`${__dirname}/..`);

const expect = require('expect');
const config = require('config');
const mongoose = require('mongoose');

// Use native promises
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost/${config.get('db')}`, { useMongoClient: true });

const testUtils = require('./testUtils');
const User = require('models/user.schema');
const userModel = require('models/user.model');

describe('User controller', () => {
  let testUser;
  let id;
  let mail;
  let password;
  let token;

  let managerToken;

  before((done) => {
    testUser = testUtils.getTestUser();

    ({ mail, password } = testUser);

    testUtils.request('POST', '/api/users/login', config.get('user_manager'), (status, body) => {
      expect(status).toBe(201);

      managerToken = body.token;

      done();
    });
  });

  describe('create', () => {
    it('should return 400 and an error msg if missing params', (done) => {
      testUtils.request('POST', '/api/users', {}, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('required');

        done();
      });
    });

    it('should return 400 if using a wrong mail', (done) => {
      const user = Object.assign({}, testUser);
      user.mail = 'notamail';

      testUtils.request('POST', '/api/users', user, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('not an accepted');

        done();
      });
    });

    it('should return 400 if using a short password', (done) => {
      const user = Object.assign({}, testUser);
      user.password = 'shortpw';

      testUtils.request('POST', '/api/users', user, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('minimum allowed length');

        done();
      });
    });

    it('should return 400 if using a short name', (done) => {
      const user = Object.assign({}, testUser);
      user.name = 'a';

      testUtils.request('POST', '/api/users', user, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('has to be at least');

        done();
      });
    });

    it('should return 400 if using a name with invalid characters', (done) => {
      const user = Object.assign({}, testUser);
      user.name = 'player9-';

      testUtils.request('POST', '/api/users', user, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('can only contain letters, spaces');

        done();
      });
    });

    it('should return 201 and the user and token if it worked', (done) => {
      testUtils.request('POST', '/api/users', testUser, (status, body) => {
        expect(status).toBe(201);
        expect(body.name).toBe(testUser.name);
        expect(body.mail).toBe(testUser.mail);
        expect(body.token).toBeA('string');
        expect(body.id).toBeA('string');
        expect(body).toExcludeKey('password');

        id = body.id;

        done();
      });
    });

    it('should return 400 if mail already exists', (done) => {
      testUtils.request('POST', '/api/users', testUser, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('already registered');

        done();
      });
    });
  });

  describe('login', () => {
    it('should return 201 if it worked', (done) => {
      testUtils.request('POST', '/api/users/login', { mail, password }, (status, body) => {
        expect(status).toBe(201);
        expect(body.id).toBeA('string');
        expect(body.token).toBeA('string');

        token = body.token;

        done();
      });
    });

    it('should return 400 if password is wrong', (done) => {
      testUtils.request('POST', '/api/users/login', { mail, password: 'wrong' }, (status) => {
        expect(status).toBe(400);

        done();
      });
    });

    it('should return 400 if mail is wrong', (done) => {
      testUtils.request('POST', '/api/users/login', { mail: 'notamail', password }, (status) => {
        expect(status).toBe(400);

        done();
      });
    });

    it('should return 400 if missing params', (done) => {
      testUtils.request('POST', '/api/users/login', {}, (status) => {
        expect(status).toBe(400);

        done();
      });
    });
  });

  describe('read', () => {
    it('should be unauthorized', (done) => {
      testUtils.request('GET', '/api/users', {}, (status, body) => {
        expect(status).toBe(401);
        expect(body.msg).toBeA('string');

        done();
      }, { Authorization: `Bearer ${token}` });
    });
  });

  describe('update', () => {
    it('should be unauthorized', (done) => {
      testUtils.request('PUT', `/api/users/${id}`, { name: 'john' }, (status, body) => {
        expect(status).toBe(401);
        expect(body.msg).toBeA('string');

        done();
      }, { Authorization: `Bearer ${token}` });
    });
  });

  describe('delete', () => {
    it('should be unauthorized', (done) => {
      testUtils.request('DELETE', `/api/users/${id}`, {}, (status, body) => {
        expect(status).toBe(401);
        expect(body.msg).toBeA('string');

        done();
      }, { Authorization: `Bearer ${token}` });
    });
  });

  describe('user manager access', () => {
    it('should be able to read users', (done) => {
      testUtils.request('GET', '/api/users', {}, (status, body) => {
        expect(status).toBe(200);
        expect(body).toBeAn('array');

        expect(body[0]).toExcludeKey('_id');
        expect(body[0]).toExcludeKey('__v');
        expect(body[0]).toExcludeKey('role');
        expect(body[0]).toExcludeKey('password');

        expect(body[0].id).toBeA('string');
        expect(body[0].name).toBeA('string');
        expect(body[0].mail).toBeA('string');

        done();
      }, { Authorization: `Bearer ${managerToken}` });
    });

    it('should be able to update users', (done) => {
      testUtils.request('PUT', `/api/users/${id}`, { name: 'john' }, (status, body) => {
        expect(status).toBe(204);
        expect(body).toNotExist();

        done();
      }, { Authorization: `Bearer ${managerToken}` });
    });

    it('should have no effect if attempting to update role', (done) => {
      testUtils.request('PUT', `/api/users/${id}`, { role: userModel.ROLES.ADMIN },
        (status, body) => {
          expect(status).toBe(204);
          expect(body).toNotExist();

          User.findById(id).then((result) => {
            expect(result.role).toBe(userModel.ROLES.USER);

            done();
          });
        }, { Authorization: `Bearer ${managerToken}` });
    });

    it('should get err when updating with wrong mail', (done) => {
      testUtils.request('PUT', `/api/users/${id}`, { mail: 'notamail' }, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('not an accepted');

        done();
      }, { Authorization: `Bearer ${managerToken}` });
    });

    it('should get err when updating with short password', (done) => {
      testUtils.request('PUT', `/api/users/${id}`, { password: 'shortpw' }, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('minimum allowed length');

        done();
      }, { Authorization: `Bearer ${managerToken}` });
    });

    it('should get err when updating without a required field', (done) => {
      testUtils.request('PUT', `/api/users/${id}`, { name: '' }, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('required');

        done();
      }, { Authorization: `Bearer ${managerToken}` });
    });

    it('should get err when updating without a short name', (done) => {
      testUtils.request('PUT', `/api/users/${id}`, { name: 'a' }, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('has to be at least');

        done();
      }, { Authorization: `Bearer ${managerToken}` });
    });

    it('should get err when updating with a name with invalid characters', (done) => {
      testUtils.request('PUT', `/api/users/${id}`, { name: 'player9-' }, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('can only contain letters, spaces');

        done();
      }, { Authorization: `Bearer ${managerToken}` });
    });

    it('should get err when updating wrong user id', (done) => {
      testUtils.request('PUT', '/api/users/id', { name: 'john' }, (status, body) => {
        expect(status).toBe(404);
        expect(body.msg).toInclude('not found');

        done();
      }, { Authorization: `Bearer ${managerToken}` });
    });

    it('should be able to delete users', (done) => {
      testUtils.request('DELETE', `/api/users/${id}`, {}, (status, body) => {
        expect(status).toBe(200);
        expect(body).toBeAn('object');

        done();
      }, { Authorization: `Bearer ${managerToken}` });
    });

    it('should get err when deleting wrong user', (done) => {
      testUtils.request('DELETE', '/api/users/id', {}, (status, body) => {
        expect(status).toBe(404);
        expect(body.msg).toInclude('not found');

        done();
      }, { Authorization: `Bearer ${managerToken}` });
    });
  });
});
