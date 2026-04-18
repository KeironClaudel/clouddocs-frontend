/**
 * Returns unique non-empty values for the provided object key.
 */
export function getUniqueValues(array, key) {
  return [...new Set(array.map((item) => item[key]))].filter(Boolean).sort();
}
