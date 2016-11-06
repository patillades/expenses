const config = require('config');
const jwt = require('jsonwebtoken');

const respObj = require('utils/respObj');

/**
 * Verify that the provided request has a valid JSON Web Token in its Authorization header
 *
 * @param {Request} req
 * @returns {Promise.<boolean, RespObj>}
 */
function verifyToken(req) {
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

    jwt.verify(token, config.get('secret'), (err, decoded) => {
      if (err) {
        console.log(err);
        return reject(respObj.getUnauthorizedResp());
      }

      console.log(decoded);
      return resolve(true);
    })
  });
}

module.exports = verifyToken;
