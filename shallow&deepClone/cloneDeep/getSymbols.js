/** Build-in value references. */
const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
const nativeGetSymbols = Object.getOwnPropertySymbols;

function getSymbols(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return nativeGetSymbols(object).filter((symbol) =>
    propertyIsEnumerable.call(object, symbol)
  );
}

export default getSymbols;