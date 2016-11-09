const http = require('http');
const querystring = require('querystring');

/**
 * Callback function to be ran when the http request ends
 *
 * @callback requestCb
 * @param {number} status
 * @param {object} body
 */

/**
 * Shorthand http request function used to run assertions on the response's status and body
 *
 * @param {string} method
 * @param {string} path
 * @param {object} params
 * @param {requestCb} cb
 * @param {object.<string, string>} additionalHeaders
 */
function request(method, path, params, cb, additionalHeaders = {}) {
  const content = method === 'POST'
    ? { 'Content-Type': 'application/x-www-form-urlencoded' }
    : {};

  const headers = Object.assign({}, content, additionalHeaders);

  const req = http.request({
    port: 3000,
    method,
    path,
    headers,
  }, res => {
    res.setEncoding('utf8');

    let body;

    res.on('data', chunk => body = JSON.parse(chunk));
    res.on('end', () => cb(res.statusCode, body));
  });

  req.write(querystring.stringify(params));
  req.end();
}

/**
 * Get a test user whose mail is timestamped to avoid "unique" validation issues on the db
 *
 * @returns {{name: string, mail: string, password: string}}
 */
function getTestUser() {
  return {
    name: 'patxi',
    mail: `test_${Date.now()}@mail.com`,
    password: 'someEasyPw',
  };
}

module.exports = { request, getTestUser };
