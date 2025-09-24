export const initFCP = (cb?: TSFunc<void>) => {
	const fcpObserver = new PerformanceObserver((entryList) => {
		for (const entry of entryList.getEntriesByName("first-content-paint")) {
			fcpObserver.disconnect();
			const fcp = entry.startTime;
			cb?.(fcp);
		}
	});

	fcpObserver.observe({ type: "paint", buffered: true });
};
