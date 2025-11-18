// import { reactive } from "galaxyObserver";
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

	getAll() {
		const result: Record<PerformanceMetric, MetricValue> = {} as Record<
			PerformanceMetric,
			MetricValue
		>;
		this.metricStore.forEach((value, key) => {
			result[key] = value;
		});
		return result;
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
