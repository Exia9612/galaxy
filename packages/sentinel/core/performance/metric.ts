import { PerformanceMetric, MetricValue } from "./type";

class PerformanceMetricStore {
	metricStore: Map<PerformanceMetric, MetricValue>;

	constructor() {
		this.metricStore = new Map();
	}

	set(metric: PerformanceMetric, value: MetricValue) {
		this.metricStore.set(metric, value);
	}

	get(metric: PerformanceMetric) {
		return this.metricStore.get(metric);
	}

	remove(metric: PerformanceMetric) {
		this.metricStore.delete(metric);
	}

	clear() {
		this.metricStore.clear();
	}

	// initFP() {
	// 	new PerformanceObserver((entryList) => {
	// 		for (const entry of entryList.getEntriesByName("first-paint")) {
	// 			this.metricStore.set(PerformanceMetric.FP, entry.startTime);
	// 		}
	// 	}).observe({ type: "paint", buffered: true });
	// }
}

export default PerformanceMetricStore;
