const expect = require('expect');
const moment = require('moment');
const config = require('config');

const testUtils = require('./testUtils');

describe('Expense controller', () => {
  let testUser;
  let id;
  let token;
  const expenseIds = [];

  let adminToken;

  before((done) => {
    testUser = testUtils.getTestUser();

    testUtils.request('POST', '/api/users', testUser, (status, body) => {
      expect(status).toBe(201);

      ({ id, token } = body);

      testUtils.request('POST', '/api/users/login', config.get('admin'), (newStatus, newBody) => {
        expect(newStatus).toBe(201, `ERR MSG: ${newBody.msg}`);

        adminToken = newBody.token;

        done();
      });
    });
  });

  describe('JWT access', () => {
    it('should return 401 if no Authorization header', (done) => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {}, (status) => {
        expect(status).toBe(401);

        done();
      });
    });

    it('should return 401 if Authorization header has wrong scheme', (done) => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {}, (status) => {
        expect(status).toBe(401);

        done();
      }, { Authorization: 'someauth' });
    });

    it('should return 401 if Authorization header has wrong scheme', (done) => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {}, (status) => {
        expect(status).toBe(401);

        done();
      }, { Authorization: 'token token' });
    });

    it('should return 401 if Authorization header has wrong token', (done) => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {}, (status) => {
        expect(status).toBe(401);

        done();
      }, { Authorization: 'Bearer token' });
    });

    it('should return 401 if the token subject does not match the user id', (done) => {
      testUtils.request('POST', '/api/users/notanid/expenses', {}, (status) => {
        expect(status).toBe(401);

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 400 if Authorization header is ok but missing params', (done) => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {}, (status) => {
        expect(status).toBe(400);

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 400 if Authorization header is ok but amount is not number', (done) => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {
        amount: 'notnumber',
        description: 'some stuff',
        date: Date.now(),
      }, (status) => {
        expect(status).toBe(400);

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 400 if Authorization header is ok but date is not a date', (done) => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {
        amount: 20,
        description: 'some stuff',
        date: 'yesterday',
      }, (status) => {
        expect(status).toBe(400);

        done();
      }, { Authorization: `Bearer ${token}` });
    });
  });

  describe('create', () => {
    it('should return 201 if everything ok', (done) => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {
        amount: 10,
        description: 'I bought some great stuff on the city center',
        date: moment().add(1, 'd').format(),
      }, (status, body) => {
        expect(status).toBe(201);
        expect(body).toExcludeKey('comment');
        expect(body).toIncludeKey('id');
        expect(body).toExcludeKey('userId');
        expect(body).toExcludeKey('_id');
        expect(body).toExcludeKey('__v');
        expect(body).toIncludeKey('expenseCategoryId');
        expect(body.expenseCategoryId).toBe(null);

        expenseIds.push(body.id);

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 201 and comment if everything ok', (done) => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {
        amount: 20,
        description: 'Went to the supermarket and picked a lot of tasty stuff',
        date: moment().subtract(1, 'd').format(),
        comment: 'cool!',
      }, (status, body) => {
        expect(status).toBe(201);
        expect(body).toIncludeKey('comment');

        expenseIds.push(body.id);

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 201 and category if everything ok', (done) => {
      const title = `category_${Date.now()}`;
      let expenseCategoryId;

      testUtils.request('POST', `/api/users/${id}/expenseCategories`, { title }, (status, body) => {
        expect(status).toBe(201);

        expenseCategoryId = body.id;

        testUtils.request('POST', `/api/users/${id}/expenses`, {
          amount: 15,
          description: 'Testing category',
          date: moment().subtract(1, 'd').format(),
          expenseCategoryId,
        }, (status, body) => {
          expect(status).toBe(201);

          expect(body).toIncludeKey('expenseCategoryId');
          expect(body.expenseCategoryId).toBe(expenseCategoryId);

          expenseIds.push(body.id);

          done();
        }, { Authorization: `Bearer ${token}` });
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 400 if category is wrong', (done) => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {
        amount: 10,
        description: 'I bought some great stuff on the city center',
        date: moment().add(1, 'd').format(),
        expenseCategoryId: 'not an object id',
      }, (status, body) => {
        expect(status).toBe(400);

        expect(body.msg).toInclude('category');

        done();
      }, { Authorization: `Bearer ${token}` });
    });
  });

  describe('read', () => {
    it('should return 200 and an array of expenses', (done) => {
      testUtils.request('GET', `/api/users/${id}/expenses`, {}, (status, body) => {
        expect(status).toBe(200);
        expect(body).toBeAn('array');
        expect(body.length).toBe(expenseIds.length);

        expect(body[0]).toIncludeKey('id');
        expect(body[0]).toExcludeKey('userId');
        expect(body[0]).toExcludeKey('_id');
        expect(body[0]).toExcludeKey('__v');

        expect(expenseIds).toInclude(body[0].id);
        expect(expenseIds).toInclude(body[1].id);

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    describe('filters', () => {
      it('should return 400 if amount not a number', (done) => {
        testUtils.request(
          'GET', `/api/users/${id}/expenses`,
          { $gte_amount: 'notanumber' },
          (status, body) => {
            expect(status).toBe(400);
            expect(body.msg).toInclude('number');

            done();
          }, { Authorization: `Bearer ${token}` }
        );
      });

      it('should return 400 if date not a date', (done) => {
        testUtils.request(
          'GET', `/api/users/${id}/expenses`,
          { $gte_date: 'notadate' },
          (status, body) => {
            expect(status).toBe(400);
            expect(body.msg).toInclude('date');

            done();
          }, { Authorization: `Bearer ${token}` }
        );
      });

      it('should return 2 expenses with an amount >= 15', (done) => {
        testUtils.request(
          'GET', `/api/users/${id}/expenses`,
          { $gte_amount: 15 },
          (status, body) => {
            expect(status).toBe(200);
            expect(body).toBeAn('array');
            expect(body.length).toBe(2);

            done();
          }, { Authorization: `Bearer ${token}` }
        );
      });

      it('should return 2 expenses with an amount <= 18', (done) => {
        testUtils.request(
          'GET', `/api/users/${id}/expenses`,
          { $lte_amount: 18 },
          (status, body) => {
            expect(status).toBe(200);
            expect(body).toBeAn('array');
            expect(body.length).toBe(2);

            done();
          }, { Authorization: `Bearer ${token}` }
        );
      });

      it('should return 3 expenses with amount >=10 <= 20', (done) => {
        testUtils.request(
          'GET', `/api/users/${id}/expenses`,
          { $gte_amount: 10, $lte_amount: 20 },
          (status, body) => {
            expect(status).toBe(200);
            expect(body).toBeAn('array');
            expect(body.length).toBe(3);

            done();
          }, { Authorization: `Bearer ${token}` }
        );
      });

      it('should return no expenses with date >= +2days', (done) => {
        testUtils.request(
          'GET', `/api/users/${id}/expenses`,
          { $gte_date: moment().add(2, 'd').format() },
          (status, body) => {
            expect(status).toBe(200);
            expect(body).toBeAn('array');
            expect(body.length).toBe(0);

            done();
          }, { Authorization: `Bearer ${token}` }
        );
      });

      it('should return 2 expenses with date <= -1days', (done) => {
        testUtils.request(
          'GET', `/api/users/${id}/expenses`,
          { $lte_date: moment().subtract(1, 'd').format() },
          (status, body) => {
            expect(status).toBe(200);
            expect(body).toBeAn('array');
            expect(body.length).toBe(2);

            done();
          }, { Authorization: `Bearer ${token}` }
        );
      });

      it('should return two expenses with the word "stuff"', (done) => {
        testUtils.request(
          'GET', `/api/users/${id}/expenses`,
          { $text: 'stuff' },
          (status, body) => {
            expect(status).toBe(200);
            expect(body).toBeAn('array');
            expect(body.length).toBe(2);

            done();
          }, { Authorization: `Bearer ${token}` }
        );
      });

      it('should return one expenses with the word "stuff" and amount >= 15', (done) => {
        testUtils.request(
          'GET', `/api/users/${id}/expenses`,
          { $text: 'stuff', $gte_amount: 15 },
          (status, body) => {
            expect(status).toBe(200);
            expect(body).toBeAn('array');
            expect(body.length).toBe(1);

            done();
          }, { Authorization: `Bearer ${token}` }
        );
      });

      it('should return one expenses with the word "supermarket"', (done) => {
        testUtils.request(
          'GET', `/api/users/${id}/expenses`,
          { $text: 'supermarket' },
          (status, body) => {
            expect(status).toBe(200);
            expect(body).toBeAn('array');
            expect(body.length).toBe(1);

            done();
          }, { Authorization: `Bearer ${token}` }
        );
      });

      it('should return no expenses with the word "table"', (done) => {
        testUtils.request(
          'GET', `/api/users/${id}/expenses`,
          { $text: 'table' },
          (status, body) => {
            expect(status).toBe(200);
            expect(body).toBeAn('array');
            expect(body.length).toBe(0);

            done();
          }, { Authorization: `Bearer ${token}` }
        );
      });

      it('should return one expenses with the phrase "a lot of tasty stuff"', (done) => {
        testUtils.request(
          'GET', `/api/users/${id}/expenses`,
          { $text: '"a lot of tasty stuff"' },
          (status, body) => {
            expect(status).toBe(200);
            expect(body).toBeAn('array');
            expect(body.length).toBe(1);

            done();
          }, { Authorization: `Bearer ${token}` }
        );
      });
    });
  });

  describe('delete', () => {
    it('should return 200 if expense found', (done) => {
      const uri = `/api/users/${id}/expenses/${expenseIds[0]}`;

      testUtils.request('DELETE', uri, {}, (status, body) => {
        expect(status).toBe(200);
        expect(body).toBeAn('object');

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 404 if expense not found', (done) => {
      const uri = `/api/users/${id}/expenses/${expenseIds[0]}`;

      testUtils.request('DELETE', uri, {}, (status, body) => {
        expect(status).toBe(404);
        expect(body.msg).toInclude('not found');

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 404 if wrong expense id', (done) => {
      const uri = `/api/users/${id}/expenses/notanid`;

      testUtils.request('DELETE', uri, {}, (status, body) => {
        expect(status).toBe(404);
        expect(body.msg).toInclude('not found');

        done();
      }, { Authorization: `Bearer ${token}` });
    });
  });

  describe('update', () => {
    it('should return 404 if expense not found', (done) => {
      const uri = `/api/users/${id}/expenses/${expenseIds[0]}`;

      testUtils.request('PUT', uri, {}, (status, body) => {
        expect(status).toBe(404);
        expect(body.msg).toInclude('not found');

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 404 if wrong expense id', (done) => {
      const uri = `/api/users/${id}/expenses/notanid`;

      testUtils.request('PUT', uri, {}, (status, body) => {
        expect(status).toBe(404);
        expect(body.msg).toInclude('not found');

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 400 if amount is empty', (done) => {
      const uri = `/api/users/${id}/expenses/${expenseIds[1]}`;

      testUtils.request('PUT', uri, { amount: '' }, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('required');

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 400 if amount is not a number', (done) => {
      const uri = `/api/users/${id}/expenses/${expenseIds[1]}`;

      testUtils.request('PUT', uri, { amount: 'not an amount' }, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('number');

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 400 if date is not a date', (done) => {
      const uri = `/api/users/${id}/expenses/${expenseIds[1]}`;

      testUtils.request('PUT', uri, { date: 'not a date' }, (status, body) => {
        expect(status).toBe(400);
        expect(body.msg).toInclude('date');

        done();
      }, { Authorization: `Bearer ${token}` });
    });

    it('should return 204 if it worked', (done) => {
      const uri = `/api/users/${id}/expenses/${expenseIds[1]}`;

      testUtils.request('PUT', uri, { description: 'new description' }, (status, body) => {
        expect(status).toBe(204);
        expect(body).toNotExist();

        done();
      }, { Authorization: `Bearer ${token}` });
    });
  });

  describe('admin access', () => {
    it('should be able to create an expense on the user\'s behalf', (done) => {
      testUtils.request('POST', `/api/users/${id}/expenses`, {
        amount: 30,
        description: 'The admin is shady',
        date: moment().add(1, 'd').format(),
      }, (status, body) => {
        expect(status).toBe(201);
        expect(body).toExcludeKey('comment');
        expect(body).toIncludeKey('id');
        expect(body).toExcludeKey('userId');
        expect(body).toExcludeKey('_id');
        expect(body).toExcludeKey('__v');

        expenseIds.push(body.id);

        done();
      }, { Authorization: `Bearer ${adminToken}` });
    });

    it('should be able to read a user\'s expenses', (done) => {
      testUtils.request('GET', `/api/users/${id}/expenses`, {}, (status, body) => {
        expect(status).toBe(200);
        expect(body).toBeAn('array');

        // one of the expenses has been deleted
        expect(body.length).toBe(expenseIds.length - 1);

        expect(body[0]).toIncludeKey('id');
        expect(body[0]).toExcludeKey('userId');
        expect(body[0]).toExcludeKey('_id');
        expect(body[0]).toExcludeKey('__v');

        expect(expenseIds).toInclude(body[0].id);
        expect(expenseIds).toInclude(body[1].id);

        done();
      }, { Authorization: `Bearer ${adminToken}` });
    });

    it('should be able to update an expense on the user\'s behalf', (done) => {
      const uri = `/api/users/${id}/expenses/${expenseIds[1]}`;

      testUtils.request('PUT', uri, { description: 'admin mind tricks' }, (status, body) => {
        expect(status).toBe(204);
        expect(body).toNotExist();

        done();
      }, { Authorization: `Bearer ${adminToken}` });
    });

    it('should be able to delete an expense on the user\'s behalf', (done) => {
      const uri = `/api/users/${id}/expenses/${expenseIds[1]}`;

      testUtils.request('DELETE', uri, {}, (status, body) => {
        expect(status).toBe(200);
        expect(body).toBeAn('object');

        done();
      }, { Authorization: `Bearer ${adminToken}` });
    });
  });
});
