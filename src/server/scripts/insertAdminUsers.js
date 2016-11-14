// add this file's directory to the node modules search path
require('app-module-path').addPath(__dirname + '/..');

const mongoose = require('mongoose');
const config = require('config');
const expect = require('expect');

const usersModel = require('models/users.model');

// Use native promises
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost/${config.get('db')}`);

mongoose.connection.on('error', err => console.error('MongoDB error: %s', err));

const db = mongoose.connection;
db.on('error', e => {
  console.log('db error', e);

  process.exit();
});

describe('admin users setup', function () {
  before(done => db.once('open', done));

  it('should insert two users or fail if already registered', done => {
    Promise.all([
      usersModel.create(
        config.get('admin'),
        usersModel.ROLES.ADMIN
      ),
      usersModel.create(
        config.get('user_manager'),
        usersModel.ROLES.USER_MANAGER
      ),
    ]).then(
      results => {
        expect(results.length).toBe(2);

        done();
      },

      err => {
        expect(err).toBe('mail already registered');

        done();
      }
    );
  });
});
