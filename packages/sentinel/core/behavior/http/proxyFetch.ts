import { HttpMetric } from "./types";

export const proxyFetch = (
	sendHandler?: TSFunc<void>,
	loadHandler?: TSFunc<void>,
) => {
	if ("fetch" in window && typeof window.fetch === "function") {
		const oFetch = window.fetch;
		(window as any).fetch = async (input: any, init: RequestInit) => {
			// init 是用户手动传入的 fetch 请求互数据，包括了 method、body、headers，要做统一拦截数据修改，直接改init即可
			if (typeof sendHandler === "function") sendHandler(init);
			let metrics = {} as HttpMetric;

			metrics.method = init?.method || "";
			metrics.url =
				(input && typeof input !== "string" ? input?.url : input) || ""; // 请求的url
			metrics.requestTime = new Date().getTime();

			return oFetch.call(window, input, init).then(async (response) => {
				// clone 出一个新的 response,再用其做.text(),避免 body stream already read 问题
				const res = response.clone();
				const responseTime = new Date().getTime();
				metrics = {
					...metrics,
					status: res.status,
					statusText: res.statusText,
					response: await res.text(),
					responseTime,
					duration: responseTime - metrics.requestTime,
				};
				if (typeof loadHandler === "function") loadHandler(metrics);
				return response;
			});
		};
	}
};
