export const getUserAgent = () => {
	const userAgent =
		typeof window === "object" && window?.navigator?.userAgent?.toLowerCase();

	return userAgent || "";
};

export const isChrome = () => {
	const userAgent = getUserAgent();
	return userAgent.includes("chrome");
};
