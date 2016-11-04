// add this file's directory to the node modules search path
require('app-module-path').addPath(__dirname);

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userController = require('controllers/user.controller');

// Use native promises
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/expenses');

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

app.post('/users', userController.createUser);

app.listen(3000, () => console.log('listening on port 3000'));
