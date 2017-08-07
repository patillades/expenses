// add this file's directory to the node modules search path
require('app-module-path').addPath(`${__dirname}/..`);

const mongoose = require('mongoose');
const moment = require('moment');
const config = require('config');
const winston = require('winston');
const expect = require('expect');
const _ = require('lodash');

const userModel = require('models/user.model');
const expenseModel = require('models/expense.model');
const expenseCategoryModel = require('models/expenseCategory.model');

// Use native promises
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost/${config.get('db')}`, { useMongoClient: true });

mongoose.connection.on('error', err => winston.error('MongoDB error: %s', err));

const db = mongoose.connection;
db.on('error', (e) => {
  winston.error('db error', e);

  process.exit();
});

const categories = [
  'test',
  'random',
];

const expenses = [
  { description: 'supermarket', amount: 15, date: moment(), comment: 'good stuff' },
  { description: 'supermarket and clothes', amount: 50, date: moment().add(1, 'd') },
  { description: 'clothes', amount: 30, date: moment().subtract(2, 'd'), comment: 'classy' },
  { description: 'computer', amount: 1000, date: moment().subtract(2, 'm'), comment: 'dell' },
  { description: 'computer software', amount: 100, date: moment().subtract(2, 'w') },
  { description: 'restaurant', amount: 60, date: moment().subtract(3, 'm'), comment: 'indian' },
  { description: 'restaurant', amount: 40, date: moment().add(3, 'd'), comment: 'cheap!' },
  { description: 'book', amount: 10, date: moment().add(8, 'd') },
  { description: 'subway pass', amount: 15.6, date: moment().subtract(8, 'd') },
  { description: 'subway ticket', amount: 2, date: moment().subtract(10, 'd') },
];

describe('Test user setup', () => {
  before(done => db.once('open', done));

  it('should insert a test user or fail if already registered', (done) => {
    let userId;

    userModel.create(
      config.get('test_user')
    ).then(
      (user) => {
        userId = user.id;

        return true;
      }
    ).then(
      () => Promise.all(
        categories.map(title => expenseCategoryModel.create({ title }, userId))
      )
    ).then(
      (categories) => Promise.all(
        expenses.map((expense, i) => {
          const exp = _.merge(
            { expenseCategoryId: categories[i % 2].id },
            expense
          );

          return expenseModel.create(exp, userId);
        })
      )
    ).then(
      (result) => {
        expect(result.length).toBe(expenses.length);

        console.info('DONE');

        done();
      }
    ).catch(
      (err) => {
        expect(err).toBe('mail already registered');

        console.error('ERROR:', err);

        done();
      }
    );
  });
});
