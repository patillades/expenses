const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('models/user.schema');
const respObj = require('utils/respObj');

/**
 * Create a user with the given params and role
 *
 * @param {{name: string, mail: string, password: string}} params
 * @param {number} role
 * @returns {Promise.<User, string>}
 */
function create(params, role) {
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
 * Verify that the given mail/password pair match to a user in the db
 *
 * @param {string} mail
 * @param {string} password - unencrypted user's password
 * @returns {Promise.<string|boolean, Error>} Resolve to the user's id if the authentication worked,
 * false otherwise; reject with an Error if there's any
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

          return resolve(same ? result.id : false);
        });
      },

      err => reject(err)
    );
  });
}

/**
 * Sign a JSON Web Token for the given user
 *
 * @param {string} sub - The user's id, used as the "subject" of the token
 * @returns {Promise.<string, RespObj>}
 */
function signToken(sub) {
  return new Promise((resolve, reject) => {
    jwt.sign({ sub }, config.get('secret'), { expiresIn: '1d' }, (err, token) => {
      // @todo add log
      if (err) {
        return reject(respObj.getInternalErrResp());
      }

      return resolve(token);
    });
  });
}

module.exports = { create, authenticate, signToken };
