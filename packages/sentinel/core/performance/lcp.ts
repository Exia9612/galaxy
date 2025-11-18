export const initLCP = (cb?: TSFunc<void>) => {
	const lcpObserver = new PerformanceObserver((entryList) => {
		const entry = entryList.getEntries();
		lcpObserver.disconnect();
		const lcp = entry[entry.length - 1].startTime;
		cb?.(lcp);
	});

	lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

	return lcpObserver;
};
