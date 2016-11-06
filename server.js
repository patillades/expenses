// add this file's directory to the node modules search path
require('app-module-path').addPath(__dirname);

// add a title so we can easily kill the process
process.title = 'expenses';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');

const userController = require('controllers/user.controller');
const expenseController = require('controllers/expense.controller');
const authorize = require('rules/authorize');

// Use native promises
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost/${config.get('db')}`);

// set mongoose debugging ON
mongoose.set('debug', true);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB error: %s', err);
});

const db = mongoose.connection;
db.on('error', e => {
  console.log('db error', e);

  process.exit();
});
db.once('open', () => console.log('db connection established'));


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/users', userController.create);
app.post('/users/login', userController.login);

// all rules below this middleware call need a JSON Web Token Authorization header
// app.use((req, res, next) => {
//   console.log('middleware', req.path);
//   console.log('middleware', req.params);
//   verifyToken(req, req.params.userId).then(
//     resolved => next(),
//
//     resp => res.status(resp.status).json({ msg: resp.msg })
//   );
// });

app.post('/users/:userId/expenses', authorize, expenseController.create);

app.listen(3000, () => console.log('listening on port 3000'));
