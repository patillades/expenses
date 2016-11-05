const User = require('models/user.schema');
const usersModel = require('models/users.model');

function createUser(req, res) {
  const user = new User(Object.assign(
    { role: 0 },
    req.body
  ));

  // wrap the save operation with a Promise, even though it already returns one,
  // in order to be able to catch mongo errors instead of only mongoose ones
  user.save((err, result) => {
    const document = new Promise((resolve, reject) => {
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
    });

    document.then(
      result => {
        const { name, mail } = result;

        return res.status(201).send({ name, mail });
      },

      msg => res.status(400).send({ msg })
    );
  })
}

function login(req, res) {
  usersModel.getByMailAndPassword(req.body.mail, req.body.password).then(
    result => {
      if (result) {
        return res.status(201).send('ok');
      }

      return res.status(400).send({ msg: 'wrong combination of user and password' });
    },

    // @todo add log
    err => res.status(500).send({ msg: 'Internal Server Error' })
  );
}

module.exports = { createUser, login };
