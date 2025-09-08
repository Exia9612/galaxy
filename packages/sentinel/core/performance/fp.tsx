export const initFP = (cb?: (...args: any[]) => void) => {
	const fpObserver = new PerformanceObserver((entryList) => {
		for (const entry of entryList.getEntriesByName("first-paint")) {
			fpObserver.disconnect();
			const FP = entry.startTime;
			cb?.(FP);
		}
	});

	fpObserver.observe({ type: "paint", buffered: true });
};
