/**
 * Convert an object to a query string so it can be sent along with an HTTP request
 *
 * @param {object} [obj={}]
 * @param {boolean} [excludeEmpty=false] - Set to TRUE in order to exclude from the resulting string
 * key-value pairs with an empty value
 * @returns {string}
 */
function objToQueryString(obj = {}, excludeEmpty = false) {
  if (excludeEmpty) {
    obj = Object.keys(obj).reduce((result, key) => {
      if (!obj[key]) {
        return result;
      }

      result[key] = obj[key];

      return result;
    }, {});
  }

  return Object.keys(obj).map(key =>
    encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
  ).join('&');
}

export default objToQueryString;
