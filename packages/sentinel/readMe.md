# Performance Timeline

## 描述

[是一个API集合，包括](https://www.w3.org/TR/performance-timeline/#abstract)

1. Navaigation timing
2. Resource timing
3. User timing
4. Paint timing

等一系列API的集合

## interface

```ts
partial interface Performance {
  PerformanceEntryList getEntries ();
  PerformanceEntryList getEntriesByType (DOMString type);
  PerformanceEntryList getEntriesByName (DOMString name, optional DOMString type);
};
typedef sequence<PerformanceEntry> PerformanceEntryList;
```

## 应用

- 通过全局变量中的performance获取需要的指标

```js
// 在script标签中嵌入下面的代码
function init() {
	// see [[USER-TIMING-2]]
	performance.mark("startWork");
	// Some developer code
	for (let i = 0; i < 1000000; i++) {}
	performance.mark("endWork");
	measurePerf();
}
function measurePerf() {
	performance
		.getEntries()
		.map((entry) => JSON.stringify(entry, null, 2))
		.forEach((json) => console.log(json));
}
init();
```

上述方式直观，使用简单。但存在下列的一些缺点

- 需要轮询去获取某些指标数据
- 当有多个数据消费者时，数据的获取存在竞态问题因此，[w3c规范](https://www.w3.org/TR/performance-timeline/#introduction)中建议使用PerformanceObserver

- PerformanceObserver PerformanceObserver通过使一系列性能指标可观测，解决上述轮询和竞态问题。消费者通过注册回调函数和指明需要检测的指标类型，可以下在数据被触发后第一时间获取数据

```js
// 以Paint timeing中的FP为例子
new PerformanceObserver((entryList) => {
	for (const entry of entryList.getEntriesByName("first-paint")) {
		// do your work
	}
}).observe({ type: "paint", buffered: true });
```

## Navaigation timing

## TS declare global

[参考](https://juejin.cn/post/7392071838640062475?searchId=202509271632274440F92C5E9A86214A09)

# Todo

## 2025.9.1

### 问题

1. performanceObserver 异步获取指标，需要解决初始化获取时为undefiend的问题
   - 实现单例模式
   - eventBus类应用为单例，可以全局获取且唯一
   - initFP时，在observer的初始化
