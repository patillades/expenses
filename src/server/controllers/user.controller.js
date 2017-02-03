const winston = require('winston');

const userModel = require('models/user.model');
const respObj = require('utils/respObj');
const errMsgs = require('utils/errMsgs');

function create(req, res) {
  let user;

  userModel.create(req.body).then(
    (result) => {
      user = result;

      return userModel.signToken({ id: user.id, role: user.role });
    },

    msg => Promise.reject(respObj.getBadReqResp(msg))
  ).then(
    (token) => {
      const result = Object.assign({}, user.toObject(), { token });

      return res.status(201).json(result);
    },

    resp => res.status(resp.status).json({ msg: resp.msg })
  );
}

function read(req, res) {
  userModel.read().then(
    result => res.status(200).json(
      result.map(user => user.toObject())
    ),

    (err) => {
      winston.error('Unhandled error on read@user.controller', err);

      return respObj.getInternalErrResp();
    }
  );
}

function update(req, res) {
  userModel.update(req.params.userId, req.body).then(
    (result) => {
      if (!result) {
        return res.status(404).json({ msg: errMsgs.USER_NOT_FOUND });
      }

      return res.status(204).json({});
    },

    resp => res.status(resp.status).json({ msg: resp.msg })
  );
}

function remove(req, res) {
  userModel.remove(req.params.userId).then(
    (result) => {
      if (!result) {
        return res.status(404).json({ msg: errMsgs.USER_NOT_FOUND });
      }

      return res.status(200).json({});
    },

    (err) => {
      // the userId had a wrong format
      if (err.name === 'CastError') {
        return res.status(404).json({ msg: errMsgs.USER_NOT_FOUND });
      }

      winston.error('Unhandled error on remove@user.controller', err);

      const resp = respObj.getInternalErrResp();

      return res.status(resp.status).json({ msg: resp.msg });
    }
  );
}

function login(req, res) {
  let userData;

  userModel.authenticate(req.body.mail, req.body.password).then(
    (result) => {
      if (result) {
        userData = Object.assign({}, result);

        return userModel.signToken(result);
      }

      return Promise.reject(respObj.getBadReqResp('wrong combination of user and password'));
    },

    (err) => {
      winston.error('Unhandled error on login@user.controller', err);

      return Promise.reject(respObj.getInternalErrResp());
    }
  ).then(
    token => res.status(201).json(Object.assign({}, userData, { token })),

    resp => res.status(resp.status).json({ msg: resp.msg })
  );
}

module.exports = { create, read, update, remove, login };
