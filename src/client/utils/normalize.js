import merge from 'lodash/merge';

/**
 * @typedef {object} NormalizedEntities
 * @property {ObjectId[]} ids
 * @property {object.<ObjectId, object>} byId
 */

/**
 * Add an entity to the normalized object
 *
 * @param {NormalizedEntities} normalized
 * @param {object} entity
 */
function addEntity(normalized, entity) {
  const clonedEntity = merge({}, entity);
  const { id } = clonedEntity;

  const ids = normalized.ids.slice();
  ids.push(id);

  const byId = merge({}, normalized.byId, { [id]: clonedEntity });

  return { ids, byId };
}

/**
 * Normalize an array of entities
 *
 * @param {object[]} entities - Array of objects that must have an "id" property
 * @return {NormalizedEntities}
 */
function normalize(entities) {
  return entities.reduce(
    addEntity,
    { ids: [], byId: {} }
  );
}

export { addEntity };
export default normalize;
