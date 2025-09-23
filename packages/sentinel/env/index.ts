import { getUserAgent, isChrome } from "../utils";

export const initSentinelGlobalObj = () => {
	if (typeof window.__SENTINEL__ === "object") return;

	window.__SENTINEL__ = {
		userAgent: getUserAgent(),
		version: {
			isChrome: isChrome(),
		},
	};
};
