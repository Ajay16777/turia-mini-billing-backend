
/**
 * Checks if an array is non-empty.
 * @param {T[]} arr - The array to check.
 * @returns {boolean} Returns true if the array is non-empty, false otherwise.
 */
export const isNonEmptyArray = <T>(arr: T[]): boolean => {
	return Array.isArray(arr) && arr.length > 0;
};

/**
 * Picks specified keys from an object.
 * @param {Record<string, any>} obj - The object to pick keys from.
 * @param {string[]} keysToPick - The array of keys to pick from the object.
 * @returns {Record<string, any>} Returns a new object with only the specified keys.
 */
export const pickKeysFromObj = (obj: any, ...keysToPick: any): any => {
	return Object.assign({}, ...keysToPick.map((k:any)=>({ [k]: obj[k] })));
};
