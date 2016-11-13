// add this file's directory to the node modules search path
require('app-module-path').addPath(__dirname);

// add a title so we can easily kill the process
process.title = 'expenses';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');

const userController = require('controllers/user.controller');
const expenseController = require('controllers/expense.controller');
const authorize = require('rules/authorize');
const ROLES = require('models/users.model').ROLES;

// Use native promises
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost/${config.get('db')}`);

// set mongoose debugging ON
mongoose.set('debug', true);
mongoose.connection.on('error', err => console.error('MongoDB error: %s', err));

const db = mongoose.connection;
db.on('error', e => {
  console.log('db error', e);

  process.exit();
});
db.once('open', () => console.log('db connection established'));

const app = express();
const apiRoutes = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/../../static'));

app.get('/', (req, res) => res.sendFile(path.resolve(__dirname + '/../../static/index.html')));

// add prefix to API routes
app.use('/api', apiRoutes);

apiRoutes.post('/users', userController.create);
apiRoutes.post('/users/login', userController.login);

const authAdmin = authorize.bind(null, [ROLES.ADMIN]);

apiRoutes.post('/users/:userId/expenses', authAdmin, expenseController.create);
apiRoutes.get('/users/:userId/expenses', authAdmin, expenseController.read);
apiRoutes.put('/users/:userId/expenses/:expenseId', authAdmin, expenseController.update);
apiRoutes.delete('/users/:userId/expenses/:expenseId', authAdmin, expenseController.remove);

app.listen(3000, () => console.log('listening on port 3000'));
