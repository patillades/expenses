// add this file's directory to the node modules search path
require('app-module-path').addPath(__dirname);

// add a title so we can easily kill the process
process.title = 'expenses';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');
const path = require('path');

const userController = require('controllers/user.controller');
const expenseController = require('controllers/expense.controller');
const expenseCategoryController = require('controllers/expenseCategory.controller');
const authorize = require('rules/authorize');
const ROLES = require('models/user.model').ROLES;

// Use native promises
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost/${config.get('db')}`);

// set mongoose debugging ON
mongoose.set('debug', true);
mongoose.connection.on('error', err => winston.error('MongoDB error: %s', err));

const db = mongoose.connection;
db.on('error', (e) => {
  winston.error('db error', e);

  process.exit();
});
db.once('open', () => winston.info('db connection established'));

const app = express();
const apiRoutes = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(`${__dirname}/../../static`)));

/**
 * Send the static index file containing the web app
 *
 * @param req
 * @param res
 */
function sendIndexFile(req, res) {
  return res.sendFile(path.resolve(`${__dirname}/../../static/index.html`));
}

app.get('/', sendIndexFile);
app.get('/login', sendIndexFile);

// add prefix to API routes
app.use('/api', apiRoutes);

const authOnlyAdminManager = authorize.bind(null, [ROLES.ADMIN, ROLES.USER_MANAGER], true);

apiRoutes.post('/users', userController.create);
apiRoutes.get('/users', authOnlyAdminManager, userController.read);
apiRoutes.put('/users/:userId', authOnlyAdminManager, userController.update);
apiRoutes.delete('/users/:userId', authOnlyAdminManager, userController.remove);

apiRoutes.post('/users/login', userController.login);

const authAdmin = authorize.bind(null, [ROLES.ADMIN], false);

apiRoutes.post('/users/:userId/expenses', authAdmin, expenseController.create);
apiRoutes.get('/users/:userId/expenses', authAdmin, expenseController.read);
apiRoutes.put('/users/:userId/expenses/:expenseId', authAdmin, expenseController.update);
apiRoutes.delete('/users/:userId/expenses/:expenseId', authAdmin, expenseController.remove);

apiRoutes.post('/users/:userId/expenseCategories', expenseCategoryController.create);
apiRoutes.get('/users/:userId/expenseCategories', expenseCategoryController.read);

app.listen(3000, () => winston.info('listening on port 3000'));
