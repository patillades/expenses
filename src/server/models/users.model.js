const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('models/user.schema');
const respObj = require('utils/respObj');

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

  return new Promise((resolve, reject) => {
    // wrap the save operation with a Promise, even though it already returns one,
    // in order to be able to catch mongo errors instead of only mongoose ones
    user.save((err, result) => {
      if (!err) {
        return resolve(result);
      }

      let msg;

      if (err.name === 'MongoError' && err.code === 11000) {
        // errors due to "unique" schema constraint
        msg = 'mail already registered';
      } else {
        // return the message belonging to the first error key
        msg = err.errors[Object.keys(err.errors)[0]].message;
      }

      return reject(msg);
    });
  });
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
      result => {
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
      // @todo add log
      if (err) {
        return reject(respObj.getInternalErrResp());
      }

      return resolve(token);
    });
  });
}

module.exports = { ROLES, create, read, authenticate, signToken };
