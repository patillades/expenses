const usersModel = require('models/users.model');

function create(req, res) {
  let name;
  let mail;

  usersModel.create(req.body, 0).then(
    result => {
      ({ name, mail } = result);

      return usersModel.signToken(mail);
    },

    msg => Promise.reject({
      status: 400,
      body: { msg }
    })
  ).then(
    token => res.status(201).json({ name, mail, token }),

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
