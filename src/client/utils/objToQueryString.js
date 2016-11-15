/**
 * Convert an object to a query string so it can be sent along with an HTTP request
 *
 * @param {object} [obj={}]
 * @param {boolean} [excludeEmpty=false] - Set to TRUE in order to exclude from the resulting string
 * key-value pairs with an empty value
 * @returns {string}
 */
function objToQueryString(obj = {}, excludeEmpty = false) {
  let params;

  if (excludeEmpty) {
    params = Object.keys(obj).reduce((result, key) => {
      if (!obj[key]) {
        return result;
      }

      return Object.assign({}, result, { [key]: obj[key] });
    }, {});
  } else {
    params = obj;
  }

  return Object.keys(params).map(key =>
    `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  ).join('&');
}

export default objToQueryString;
