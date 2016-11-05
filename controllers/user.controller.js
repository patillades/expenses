const usersModel = require('models/users.model');

function create(req, res) {
  usersModel.create(req.body, 0).then(
    result => {
      const { name, mail } = result;

      return res.status(201).json({ name, mail });
    },

    msg => res.status(400).json({ msg })
  );
}

function login(req, res) {
  usersModel.getByMailAndPassword(req.body.mail, req.body.password).then(
    result => {
      if (result) {
        return res.status(201).json({ msg: 'ok' });
      }

      return res.status(400).json({ msg: 'wrong combination of user and password' });
    },

    // @todo add log
    err => res.status(500).json({ msg: 'Internal Server Error' })
  );
}

module.exports = { create, login };
