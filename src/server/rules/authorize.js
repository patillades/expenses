const config = require('config');
const jwt = require('jsonwebtoken');

const respObj = require('utils/respObj');

/**
 * Verify that the provided request has a valid JSON Web Token in its Authorization header; and that
 * the provided user id matches the subject of the token, or that the role that the token was signed
 * with is allowed in the middleware params
 *
 * @param {Request} req
 * @param {string} userId - The id of the user making the request, it's provided as a named route
 * parameter
 * @param {number[]} roles
 * @param {boolean} onlyToRoles
 * @returns {Promise.<boolean, RespObj>}
 */
function verifyToken(req, userId, roles, onlyToRoles) {
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
        let msg;

        if (err.name === 'TokenExpiredError') {
          msg = err.name;
        }

        return reject(respObj.getUnauthorizedResp(msg));
      }

      if (
        !roles.includes(decoded.role)
        && (
          onlyToRoles
          || decoded.sub !== userId
        )
      ) {
        return reject(respObj.getUnauthorizedResp());
      }

      return resolve(true);
    });
  });
}

/**
 * Middleware call that verifies the presence of a JSON Web Token Authorization header
 *
 * @param {number[]} roles - users with the roles provided in this array will be authorized even if
 * their token's "sub" claim doesn't match the route's :userId param
 * @param {boolean} onlyToRoles - when set to true, authorization for the route this middleware is
 * intercepting is ONLY allowed to the users with a role included in the roles parameter
 * @param req
 * @param res
 * @param next
 */
function authorize(roles, onlyToRoles, req, res, next) {
  verifyToken(req, req.params.userId, roles, onlyToRoles).then(
    resolved => next(),

    resp => res.status(resp.status).json({ msg: resp.msg })
  );
}

module.exports = authorize;
