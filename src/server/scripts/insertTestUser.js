// add this file's directory to the node modules search path
require('app-module-path').addPath(`${__dirname}/..`);

const mongoose = require('mongoose');
const moment = require('moment');
const config = require('config');
const winston = require('winston');
const expect = require('expect');

const userModel = require('models/user.model');
const expenseModel = require('models/expense.model');

// Use native promises
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost/${config.get('db')}`);

mongoose.connection.on('error', err => winston.error('MongoDB error: %s', err));

const db = mongoose.connection;
db.on('error', (e) => {
  winston.error('db error', e);

  process.exit();
});

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

describe('admin users setup', () => {
  before(done => db.once('open', done));

  it('should insert a test user or fail if already registered', (done) => {
    userModel.create(
      config.get('test_user'),
      userModel.ROLES.ADMIN
    ).then(
      user => Promise.all(
        expenses.map(expense => expenseModel.create(expense, user.id))
      ),

      err => Promise.reject(err)
    ).then(
      (result) => {
        expect(result.length).toBe(expenses.length);

        done();
      },

      (err) => {
        expect(err).toBe('mail already registered');

        done();
      }
    );
  });
});
