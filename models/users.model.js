const User = require('models/user.schema');
const bcrypt = require('bcrypt');

/**
 * Create a user with the given params and role
 *
 * @param {object} params
 * @param {number} role
 * @returns {Promise.<User, string>}
 */
function create(params, role) {
  const user = new User(Object.assign(
    { role },
    params
  ));

  return new Promise((resolve, reject) => {
    // wrap the save operation with a Promise, even though it already returns one,
    // in order to be able to catch mongo errors instead of only mongoose ones
    user.save((err, result) => {
      if (!err) {
        return resolve(result);
      }

      if (err.name === 'MongoError' && err.code === 11000) {
        // errors de to "unique" schema constraint
        reject('mail already registered');
      } else {
        // return the message belonging to the first error key
        reject(err.errors[Object.keys(err.errors)[0]].message);
      }
    })
  });
}

/**
 *
 * @param {string} mail
 * @param {string} password - unencrypted user's password
 * @returns {Promise.<boolean, Error>}
 */
function getByMailAndPassword(mail, password) {
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

          return resolve(same);
        })
      },

      err => reject(err)
    );

  });
}

module.exports = { create, getByMailAndPassword };
