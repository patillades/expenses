const usersModel = require('models/users.model');

const respObj = require('utils/respObj');

function create(req, res) {
  let user;

  usersModel.create(req.body).then(
    result => {
      user = result;

      return usersModel.signToken({ id: user.id, role: user.role });
    },

    msg => Promise.reject(respObj.getBadReqResp(msg))
  ).then(
    token => {
      const result = Object.assign({}, user.toObject(), { token });

      return res.status(201).json(result);
    },

    resp => res.status(resp.status).json({ msg: resp.msg })
  );
}

function read(req, res) {
  usersModel.read().then(
    result => res.status(200).json(
      result.map(user => user.toObject())
    ),

    // @todo add log
    err => respObj.getInternalErrResp()
  );
}

function login(req, res) {
  usersModel.authenticate(req.body.mail, req.body.password).then(
    result => {
      if (result) {
        return usersModel.signToken(result);
      }

      return Promise.reject(respObj.getBadReqResp('wrong combination of user and password'));
    },

    // @todo add log
    err => Promise.reject(respObj.getInternalErrResp())
  ).then(
    token => res.status(201).json({ token }),

    resp => res.status(resp.status).json({ msg: resp.msg })
  );
}

module.exports = { create, read, login };
