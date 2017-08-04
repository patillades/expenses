const errMsgs = require('utils/errMsgs');

/**
 * Wrap mongoose's save operation with a Promise, even though it already returns one, in order to
 * be able to catch mongo errors instead of only mongoose ones
 *
 * @param {model} entity - Entity of a mongoose schema
 */
function saveEntity(entity, modelName) {
  return new Promise((resolve, reject) => {
    entity.save((err, result) => {
      if (!err) {
        return resolve(result);
      }

      let msg;

      if (err.name === 'MongoError' && err.code === 11000) {
        msg = errMsgs.getUniqueErrorMsg(modelName);
      } else {
        msg = errMsgs.getValidationErrorMsg(err, modelName);
      }

      return reject(msg);
    });
  });
}

module.exports = saveEntity;
