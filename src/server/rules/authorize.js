const config = require('config');
const jwt = require('jsonwebtoken');

const respObj = require('utils/respObj');

/**
 * Verify that the provided request has a valid JSON Web Token in its Authorization header
 *
 * @param {Request} req
 * @param {string} userId - The id of the user making the request, it's provided as a named route
 * parameter
 * @returns {Promise.<boolean, RespObj>}
 */
function verifyToken(req, userId) {
  const auth = req.get('Authorization');

  return new Promise((resolve, reject) => {
    if (!auth) {
      return reject(respObj.getUnauthorizedResp('Authorization token is missing.'));
    }

    const parts = auth.split(' ');

    if (parts.length !== 2) {
      return reject(respObj.getUnauthorizedResp());
    }

    const scheme = parts[0];
    const token = parts[1];

    if (!/^Bearer$/i.test(scheme)) {
      return reject(respObj.getUnauthorizedResp());
    }

    jwt.verify(token, config.get('secret'), { subject: userId }, err => {
      if (err) {
        let msg;

        if (err.name === 'TokenExpiredError') {
          msg = err.name;
        }

        return reject(respObj.getUnauthorizedResp(msg));
      }

      return resolve(true);
    })
  });
}

/**
 * Middleware call that verifies the presence of a JSON Web Token Authorization header
 *
 * @param req
 * @param res
 * @param next
 */
function authorize(req, res, next) {
  verifyToken(req, req.params.userId).then(
    resolved => next(),

    resp => res.status(resp.status).json({ msg: resp.msg })
  );
}

module.exports = authorize;
