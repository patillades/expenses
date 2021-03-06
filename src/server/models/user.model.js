const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const winston = require('winston');
const _ = require('lodash');

const User = require('models/user.schema');
const Expense = require('models/expense.schema');
const respObj = require('utils/respObj');
const errMsgs = require('utils/errMsgs');
const saveEntity = require('utils/saveEntity');

const ROLES = {
  USER: 0,
  USER_MANAGER: 1,
  ADMIN: 2,
};

/**
 * Create a user with the given params and role
 *
 * @param {{name: string, mail: string, password: string}} params
 * @param {number} [role=ROLES.USER]
 * @returns {Promise.<User, string>}
 */
function create(params, role = ROLES.USER) {
  const user = new User(Object.assign(
    {},
    params,
    { role }
  ));

  return saveEntity(user, User.modelName);
}

/**
 * Read users
 *
 * @returns {Promise.<User[], Error>}
 */
function read() {
  return User.find();
}

/**
 * Update a user with the given params
 *
 * @param {ObjectId} _id
 * @param {object} params - fields to be updated
 * @return {Promise.<User, RespObj>}
 */
function update(_id, params) {
  // restrict the fields that can be updated
  const fields = _.pick(params, ['name', 'mail', 'password']);

  return User
    .findByIdAndUpdate(_id, fields, { runValidators: true })
    .then(
      result => result,

      (err) => {
        if (err.name === 'ValidationError') {
          return Promise.reject(
            respObj.getBadReqResp(errMsgs.getValidationErrorMsg(err, User.modelName))
          );
        }

        if (err.name === 'CastError') {
          return Promise.reject(
            errMsgs.getCastErrorMsg(err.path, User.modelName)
          );
        }

        winston.error('Unhandled error on update@user.model', err);

        return Promise.reject(
          respObj.getInternalErrResp()
        );
      }
    );
}

/**
 * Remove a given user and all its expenses
 *
 * @param {ObjectId} _id - The id of the user to be removed
 * @return {Promise.<User, Error>}
 */
function remove(_id) {
  return Promise.all([
    User.findByIdAndRemove(_id),
    Expense.remove({ userId: _id }),
  ]);
}

/**
 * Verify that the given mail/password pair match to a user in the db
 *
 * @param {string} mail
 * @param {string} password - unencrypted user's password
 * @returns {Promise.<{id: ObjectId, role: number}|boolean, Error>} Resolve to the user's id and
 * role if the authentication worked, false otherwise; reject with an Error if there's any
 */
function authenticate(mail, password) {
  const user = User.findOne({ mail });

  return new Promise((resolve, reject) => {
    user.then(
      (result) => {
        // user not found
        if (!result) {
          return resolve(false);
        }

        bcrypt.compare(password, result.password, (err, same) => {
          if (err) {
            return reject(err);
          }

          return resolve(
            same
              ? { id: result.id, role: result.role }
              : false
          );
        });
      },

      err => reject(err)
    );
  });
}

/**
 * Sign a JSON Web Token for the given user
 *
 * @param {{id: ObjectId, role: number}} user - The user's id and role, used as token payload
 * @returns {Promise.<string, RespObj>}
 */
function signToken(user) {
  return new Promise((resolve, reject) => {
    const payload = { sub: user.id, role: user.role };

    jwt.sign(payload, config.get('secret'), { expiresIn: '1d' }, (err, token) => {
      if (err) {
        winston.error('Unhandled error on signToken@user.model', err);

        return reject(respObj.getInternalErrResp());
      }

      return resolve(token);
    });
  });
}

module.exports = { ROLES, create, read, update, remove, authenticate, signToken };
