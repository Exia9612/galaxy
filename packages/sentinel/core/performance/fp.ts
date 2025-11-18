// FP: 首次绘制，标记浏览器渲染任何在视觉上不同于导航前屏幕内容的时间点

export const initFP = (cb?: (...args: any[]) => void) => {
	const fpObserver = new PerformanceObserver((entryList) => {
		for (const entry of entryList.getEntriesByName("first-paint")) {
			fpObserver.disconnect();
			const FP = entry.startTime;
			cb?.(FP);
		}
	});

	fpObserver.observe({ type: "paint", buffered: true });

	return fpObserver;
};
