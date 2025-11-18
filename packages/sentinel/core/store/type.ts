// 监控指标
export enum PerformanceMetric {
	FP = "first-paint",
	FCP = "first-contentful-paint",
	LCP = "largest-contentful-paint",
}

export type MetricValue = string | number;
