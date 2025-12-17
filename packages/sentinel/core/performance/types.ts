// https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceResourceTiming

export interface TechnicalPerformanceMetrics {
	TTI?: number; // Time to Interactive
	DomReady?: number; // Time to DOM Ready
	Load?: number; // Time to Load step
	FirstByte?: number; // Time to First Byte
	DNS?: number;
	TCP?: number;
	SSL?: number;
	TTFB?: number;
	Trans?: number; // 内容传输耗时
	DomParse?: number;
	name: string;
	isCached?: boolean; // 是否是缓存资源
}

// 监控指标
export enum PerformanceMetric {
	FP = "first-paint",
	FCP = "first-contentful-paint",
	LCP = "largest-contentful-paint",
	FID = "first-input-delay",
	STC_RES = "static-resources",
}

export type MetricValue = string | number | TechnicalPerformanceMetrics[];
