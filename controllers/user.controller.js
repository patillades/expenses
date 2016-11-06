const usersModel = require('models/users.model');

const respObj = require('utils/respObj');

function create(req, res) {
  let user;

  usersModel.create(req.body, 0).then(
    result => {
      user = result;

      return usersModel.signToken(user.id);
    },

    msg => Promise.reject(respObj.getBadReqResp(msg))
  ).then(
    token => {
      const { id, name, mail } = user;

      return res.status(201).json({ id, name, mail, token })
    },

    resp => res.status(resp.status).json({ msg: resp.msg })
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

module.exports = { create, login };
