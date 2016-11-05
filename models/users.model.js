const User = require('models/user.schema');
const bcrypt = require('bcrypt');

function getByMailAndPassword(mail, password) {
  const user = User.findOne({ mail });

  user.then(
    result => {
      bcrypt.compare(password, result.password, (err, same) => {
        console.log('bcrypt compare', err, same);
      })
    },
    err => console.log('getByMailAndPassword err', err)
  )
}

module.exports = { getByMailAndPassword };
