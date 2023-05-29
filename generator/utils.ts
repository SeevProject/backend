// function that flattens an object to a single level
// turns { a: { b: { c: 1 } } } into { a.b.c: 1 }
export function flattenObject(obj: any) {
	const flattenedObject: any = {};

	function flatten(obj: any, prefix: string) {
		Object.keys(obj).forEach((key) => {
			const value = obj[key];

			if (typeof value === "object") {
				flatten(value, `${prefix}${key}.`);
			} else {
				flattenedObject[`${prefix}${key}`] = value;
			}
		});
	}

	flatten(obj, "");

	return flattenedObject;
}
