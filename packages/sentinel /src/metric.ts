export enum metricsName {
	FP = "first-paint",
	FCP = "first-contentful-paint",
	LCP = "largest-contentful-paint",
	FID = "first-input-delay",
	CLS = "cumulative-layout-shift",
	NT = "navigation-timing",
	RF = "resource-flow",
}

export interface IMetrics {
	[prop: string | number]: any;
}

export default class Metric {
	state: Map<metricsName | string, IMetrics>;

	constructor() {
		this.state = new Map();
	}
}
