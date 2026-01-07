import { PageInformation } from "./types";

export const getPageInfo = (cb?: TSFunc<void>) => {
	const {
		host,
		hostname,
		href,
		protocol,
		origin,
		port,
		pathname,
		search,
		hash,
	} = window.location;
	const { width, height } = window.screen;
	const { language, userAgent } = navigator;

	const pageInfo: PageInformation = {
		host,
		hostname,
		href,
		protocol,
		origin,
		port,
		pathname,
		search,
		hash,
		title: document.title,
		language: language.substr(0, 2),
		userAgent,
		winScreen: `${width}x${height}`,
		docScreen: `${document.documentElement.clientWidth || document.body.clientWidth}x${
			document.documentElement.clientHeight || document.body.clientHeight
		}`,
	};

	cb?.(pageInfo);
};
