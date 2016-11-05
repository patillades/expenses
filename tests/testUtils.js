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
 */
function request(method, path, params, cb) {
  const headers = method === 'POST'
    ? { 'Content-Type': 'application/x-www-form-urlencoded' }
    : {};

  const req = http.request({
    port: 3000,
    method,
    path,
    headers
  }, res => {
    res.setEncoding('utf8');

    let body;

    res.on('data', chunk => body = JSON.parse(chunk));
    res.on('end', () => cb(res.statusCode, body));
  });

  req.write(querystring.stringify(params));
  req.end();
}

module.exports = { request };
