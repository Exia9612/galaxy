/**
 * 一般的路由跳转行为，都是针对于 SPA单页应用的，因为对于非单页应用来说，url跳转都以页面刷新的形式;
 * 路由跳转的一般有
 * 1. Hash 变化
 *  - hash 变化除了触发 hashchange ,也会触发 popstate 事件,而且会先触发 popstate 事件，我们可以统一监听 popstate
 * 2. History 路由变化
 *  - History路由有5个API
 *    history.back()
			history.go()
			history.forward()
			history.pushState()
			history.replaceState()
		- back、go、forward调用时都会触发popstate事
 *  - History.pushState()和History.replaceState()因为是直接操作浏览器url地址，所以不会触发popstate事件
 *  - 所以需要通过重写这两个方法，来触发自定事件，达到监听这两个事件的目的
 */

const dispatchHistoryEvent = (event: keyof History) => {
	const originalHistory = history[event];

	return function (this: unknown) {
		// eslint-disable-next-line prefer-rest-params
		const result = originalHistory.apply(this, arguments);
		window.dispatchEvent(new Event(event));
		return result;
	};
};

export const proxyPushStateAndReplaceState = (handler: TSFunc<void>) => {
	window.history.pushState = dispatchHistoryEvent("pushState");
	window.history.replaceState = dispatchHistoryEvent("replaceState");

	// addEventListener 第三个参数说明：
	// 1. 布尔值形式（旧 API）：true 表示在捕获阶段监听，false 表示在冒泡阶段监听
	// 2. 选项对象形式（新 API）：{ capture: true, once: false, passive: false }
	// 这里使用 true 表示在捕获阶段监听 popstate 事件，确保能更早捕获到路由变化
	window.addEventListener("pushState", (e) => handler(e), true);
	window.addEventListener("replaceState", (e) => handler(e), true);
};

export const proxyHashAndOtherHistoryEvent = (handler: TSFunc<void>) => {
	window.addEventListener("popstate", (e) => handler(e), true);
};

export const initRouterChangeRecord = (handler: TSFunc<void>): void => {
	proxyHashAndOtherHistoryEvent(handler);
	proxyPushStateAndReplaceState(handler);
};
