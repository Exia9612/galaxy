export const isObject = (val: any) => {
	return typeof val === "object" && val !== null;
};

export const hasChanged = (value1: any, value2: any) => {
	return !Object.is(value1, value2);
};
