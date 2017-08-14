/**
 * Get the value on the given object and key, or NULL if missing or falsy
 *
 * @param {object} object
 * @param {string} key
 * @return {any}
 */
function getOrNull(object, key) {
  return object[key] ? object[key] : null;
}

module.exports = getOrNull;
