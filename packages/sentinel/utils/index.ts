export const getUserAgent = () => {
	const userAgent =
		typeof window === "object" && window?.navigator?.userAgent?.toLowerCase();

	return userAgent || "";
};

export const isChrome = () => {
	const userAgent = getUserAgent();
	return userAgent.includes("chrome");
};

export const generateUniqueID = () => {
	return `ys-${Date.now()}-${Math.floor(Math.random() * (9e12 - 1))}`;
};
