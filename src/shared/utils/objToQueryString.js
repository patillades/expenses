/**
 * Convert an object to a query string so it can be sent along with a POST request
 *
 * @param {object} [obj={}]
 * @returns {string}
 */
function objToQueryString(obj = {}) {
  return Object.keys(obj).map(key =>
    encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
  ).join('&');
}

export default objToQueryString;
