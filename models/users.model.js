const User = require('models/user.schema');
const bcrypt = require('bcrypt');

/**
 *
 * @param {string} mail
 * @param {string} password - unencrypted user's password
 * @returns {Promise.<boolean, Error>}
 */
function getByMailAndPassword(mail, password) {
  return new Promise((resolve, reject) => {
    User.findOne({ mail }).then(
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

module.exports = { getByMailAndPassword };
