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
 * Get a bad request response with the given message
 *
 * @param {string} msg
 * @returns {RespObj}
 */
function getBadReqResp(msg) {
  return getRespObj(400, msg);
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

const INTERNAL_ERR = 'Internal Server Error';

/**
 * Get an internal server error response with the given message
 *
 * @param {string} msg
 * @returns {RespObj}
 */
function getInternalErrResp(msg = INTERNAL_ERR) {
  return getRespObj(500, msg);
}

module.exports = { getBadReqResp, getUnauthorizedResp, getInternalErrResp };
