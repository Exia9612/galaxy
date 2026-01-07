import { HttpMetric } from "./types";

export const proxyXml = (
	sendHandler?: TSFunc<void>,
	loadHandler?: TSFunc<void>,
) => {
	if (
		"XMLHttpRequest" in window &&
		typeof window.XMLHttpRequest === "function"
	) {
		const originalXMLHttpRequest = window.XMLHttpRequest;

		(window as any).XMLHttpRequest = function () {
			const xhr = new originalXMLHttpRequest();
			const { open, send } = xhr;
			let httpMetric: HttpMetric = {} as HttpMetric;

			xhr.open = (method, url) => {
				httpMetric.method = method;
				httpMetric.url = url;
				open.call(xhr, method, url, true);
			};

			xhr.send = (body) => {
				httpMetric.requestTime = new Date().getTime();
				if (typeof sendHandler === "function") {
					sendHandler(xhr);
				}
				send.call(xhr, body);
			};

			xhr.addEventListener("loadend", () => {
				const { status, statusText, response } = xhr;
				httpMetric = {
					...httpMetric,
					status,
					statusText,
					response,
					responseTime: new Date().getTime(),
					duration: new Date().getTime() - httpMetric.requestTime,
				};
				if (typeof loadHandler === "function") {
					loadHandler(httpMetric);
				}
			});

			return xhr;
		};
	}
};
