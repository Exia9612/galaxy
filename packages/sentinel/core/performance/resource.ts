import { TechnicalPerformanceMetrics } from "./types";

export const initrResourcePref = (cb?: TSFunc<void>) => {
	// 继承关系 PerformaceEntry <- PerformaceResourceTiming <- PerformanceNavigationTiming
	// https://developer.mozilla.org/zh-CN/docs/Web/API/
	const resourceList: TechnicalPerformanceMetrics[] = [];
	const resourceObserver = new PerformanceObserver((entryList) => {
		entryList.getEntriesByType("resource").forEach((resourceEntry: any) => {
			const {
				domainLookupStart,
				domainLookupEnd,
				connectStart,
				connectEnd,
				secureConnectionStart,
				requestStart,
				responseStart,
				responseEnd,
				domInteractive,
				domContentLoadedEventEnd,
				loadEventStart,
				fetchStart,
				name,
				transferSize,
				duration,
			} = resourceEntry as PerformanceNavigationTiming;

			const list: TechnicalPerformanceMetrics = {
				name,
				TTI: domInteractive - fetchStart,
				DomReady: domContentLoadedEventEnd - fetchStart,
				Load: loadEventStart - fetchStart,
				FirstByte: responseStart - domainLookupStart,
				DNS: domainLookupEnd - domainLookupStart,
				TCP: connectEnd - connectStart,
				SSL: secureConnectionStart ? connectEnd - secureConnectionStart : 0,
				TTFB: responseStart - requestStart,
				Trans: responseEnd - responseStart,
				DomParse: domInteractive - responseEnd,
				/**
				 * 静态资源的 duration 为0；
				 * 静态资源的 transferSize 不为0；
				 */
				isCached: transferSize !== 0 && duration === 0,
			};

			resourceList.push(list);
		});
	});

	resourceObserver.observe({ type: "resource", buffered: true });

	const stopOberver = () => {
		if (resourceObserver) {
			resourceObserver.disconnect();
		}

		cb?.(resourceList);
	};

	window.addEventListener("pageshow", stopOberver, {
		once: true,
		capture: true,
	});
};
