const expect = require('expect');

const testUtils = require('./testUtils');

describe('Expense category controller', () => {
  let testUser;
  let id;
  let token;

  before((done) => {
    testUser = testUtils.getTestUser();

    testUtils.request('POST', '/api/users', testUser, (status, body) => {
      expect(status).toBe(201);

      ({ id, token } = body);

      console.log('user id', id);
      console.log('token', token);

      done();
    });
  });

  describe('create', () => {
    const title = `category_${Date.now()}`;

    it('should return 201 if everything ok', (done) => {
      testUtils.request('POST', `/api/users/${id}/expenseCategories`, { title }, (status, body) => {
        expect(status).toBe(201);
        expect(body).toIncludeKey('title');
        expect(body).toExcludeKey('userId');
        expect(body).toExcludeKey('_id');
        expect(body).toExcludeKey('__v');

        expect(body.title).toBe(title);
        expect(body.id).toBeA('string');

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 400 if title already exists', (done) => {
      testUtils.request('POST', `/api/users/${id}/expenseCategories`, { title }, (status, body) => {
        expect(status).toBe(400);

        expect(body.msg).toContain('exists');

        done();
      }, { Authorization: `Bearer ${token}` });
    });
  });

  describe('read', () => {
    it('should return 200 if everything ok', (done) => {
      testUtils.request('GET', `/api/users/${id}/expenseCategories`, {}, (status, body) => {
        expect(status).toBe(200);
        expect(body).toBeAn('array');
        expect(body.length).toBeGreaterThan(0);

        done();
      }, { Authorization: `Bearer ${token}` });
    });
  });
});
