import { PerformanceMetric, MetricValue } from "./type";

class Store {
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

	has(metric: PerformanceMetric) {
		return this.metricStore.has(metric);
	}
}

export default Store;
