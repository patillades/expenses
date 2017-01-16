// add this file's directory to the node modules search path
require('app-module-path').addPath(`${__dirname}/..`);

const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');
const expect = require('expect');

const userModel = require('models/user.model');

// Use native promises
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost/${config.get('db')}`);

mongoose.connection.on('error', err => winston.error('MongoDB error: %s', err));

const db = mongoose.connection;
db.on('error', (e) => {
  winston.error('db error', e);

  process.exit();
});

describe('admin users setup', () => {
  before(done => db.once('open', done));

  it('should insert two users or fail if already registered', (done) => {
    Promise.all([
      userModel.create(
        config.get('admin'),
        userModel.ROLES.ADMIN
      ),
      userModel.create(
        config.get('user_manager'),
        userModel.ROLES.USER_MANAGER
      ),
    ]).then(
      (results) => {
        expect(results.length).toBe(2);

        done();
      },

      (err) => {
        expect(err).toBe('mail already registered');

        done();
      }
    );
  });
});
