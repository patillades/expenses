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
  usersModel.authenticate(req.body.mail, req.body.password).then(
    result => {
      if (result) {
        return usersModel.signToken(req.body.mail);
      }

      return Promise.reject({
        status: 400,
        body: { msg: 'wrong combination of user and password' }
      });
    },

    // @todo add log
    err => Promise.reject({
      status: 500,
      body: { msg: 'Internal Server Error' }
    })
  ).then(
    token => res.status(201).json({ token }),

    obj => res.status(obj.status).json(obj.body)
  );
}

module.exports = { create, login };
