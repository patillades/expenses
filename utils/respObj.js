/**
 * Response object
 *
 * @typedef {object} RespObj
 * @property {number} status
 * @property {string} msg
 */

/**
 * Get a response object
 *
 * @param {number} status
 * @param {string} msg
 * @returns {RespObj}
 */
function getRespObj(status, msg) {
  return { status, msg };
}

/**
 * Get an unauthorized response with the given message
 *
 * @param {string} msg
 * @returns {RespObj}
 */
function getUnauthorizedResp(msg = 'Format is Authorization: Bearer [token]') {
  return getRespObj(401, msg);
}

module.exports = { getUnauthorizedResp };
