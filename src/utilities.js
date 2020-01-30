/**
 * <code>merge</code> copies fills any entry in dest with a corresponding entry src,
 * recursively ensuring that if
 *  src[entry0][entry1]...[entryN] !== undefined    then
 *  dest[entry0][entry1]...[entryN] !== undefined
 *
 * Additionally, if dest is undefined then it will be replaced with src
 *
 * @param {object} dest the destination object which we will merge into
 * @param {object} src the source object which we will merge from
 */
function merge (dest, src) {
  // if nothing is passed as dest, then just return src
  // and the merge is complete
  if (dest === undefined || dest === null) {
    return src
  }

  // if dest is not undefined, but either src or dest is not an object,
  // then we cannot merge the values. We must assume that dest is correct
  if (typeof src !== 'object' || typeof dest !== 'object') {
    return dest
  }

  for (const entry in src) {
    // For each entry in src, recursively merge the entry in src with the entry in dest
    // Note that if dest[entry] is undefined, then we will hit the null check above, and
    // the recursion will stop.
    dest[entry] = merge(dest[entry], src[entry])
  }

  return dest
}

module.exports = { merge }
