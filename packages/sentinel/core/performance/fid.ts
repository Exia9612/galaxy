// FID 是从用户第一次与页面交互（例如当他们单击链接、点按按钮或使用由 JavaScript 驱动的自定义控件）直到浏览器对交互作出响应，并实际能够开始处理事件处理程序所经过的时间

export const initFID = (cb?: TSFunc<void>) => {
	const fidObserver = new PerformanceObserver((entryList) => {
		const entries = entryList.getEntries();
		const entry = entries[entries.length - 1];
		const fid = (entry as any).processingStart - entry.startTime;
		cb?.(fid);
	});

	// { buffered: true } 选项表示在 observer 创建之前发生的匹配事件也会被包含在第一次回调中
	fidObserver.observe({ type: "first-input", buffered: true });

	return fidObserver;
};
