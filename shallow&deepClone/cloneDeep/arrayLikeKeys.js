import isArguments from "./isArguments";
import isIndex from "./isIndex";

/** Used to check objects for own properties. */
const hasOwnProperty = Object.prototype.hasOwnProperty;

function arrayLikeKeys(value, inherited) {
  const isArr = Array.isArray(value);
  const isArg = !isArr && isArguments(value);
  const skipIndexes = isArr || isArg;
  const length = value.length;
  const result = new Array(skipIndexes ? length : 0);
  let index = skipIndexes ? -1 : length;

  while (++index < length) {
    result[index] = `${index}`;
  }

  for (const key in value) {
    if (
      (inherited || hasOwnProperty.call(value, key)) &&
      !(
        skipIndexes &&
        // Safari 9 has enumerable `arguments.length` in strict mode.
        (key === "length" ||
          // Skip index properties.
          isIndex(key, length))
      )
    ) {
      result.push(key);
    }
  }
  return result;
}

export default arrayLikeKeys;
