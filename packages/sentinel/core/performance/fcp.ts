// FCP: 首次内容绘制，标记的是浏览器渲染第一针内容 DOM 的时间点，该内容可能是文本、图像、SVG 或者 <canvas> 等元素

export const initFCP = (cb?: TSFunc<void>) => {
	const fcpObserver = new PerformanceObserver((entryList) => {
		for (const entry of entryList.getEntriesByName("first-contentful-paint")) {
			fcpObserver.disconnect();
			const fcp = entry.startTime;
			cb?.(fcp);
		}
	});

	// { buffered: true } 选项表示在 observer 创建之前发生的匹配事件也会被包含在第一次回调中
	fcpObserver.observe({ type: "paint", buffered: true });

	return fcpObserver;
};
