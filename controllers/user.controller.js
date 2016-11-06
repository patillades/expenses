const usersModel = require('models/users.model');

function create(req, res) {
  let user;

  usersModel.create(req.body, 0).then(
    result => {
      user = result;

      return usersModel.signToken(user.mail);
    },

    msg => Promise.reject({
      status: 400,
      body: { msg }
    })
  ).then(
    token => {
      const { id, name, mail } = user;

      return res.status(201).json({ id, name, mail, token })
    },

    obj => res.status(obj.status).json(obj.body)
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
