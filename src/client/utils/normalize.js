import merge from 'lodash/merge';

/**
 * Add an entity to the normalized object
 *
 * @param {object} obj
 * @param {ObjectId[]} idsArr
 * @param {object.<ObjectId, object>} byIdObj
 */
function addEntity(obj, idsArr, byIdObj) {
  const entity = merge({}, obj);
  const { id } = entity;

  const ids = idsArr.slice();
  ids.push(id);

  const byId = merge({}, byIdObj, { [id]: entity });

  return { ids, byId };
}

/**
 * @typedef {object} NormalizedEntities
 * @property {ObjectId[]} ids
 * @property {object.<ObjectId, object>} byId
 */

/**
 * Normalize an array of entities
 *
 * @param {object[]} entities - Array of objects that must have an "id" property
 * @return {NormalizedEntities}
 */
function normalize(entities) {
  return entities.reduce(
    (result, entity) => addEntity(entity, result.ids, result.byId),
    { ids: [], byId: {} }
  );
}

export { addEntity };
export default normalize;
