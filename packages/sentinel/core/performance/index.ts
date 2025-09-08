import Store from "../store/metric";
import { PerformanceMetric } from "../store/type";

class PerformanceMetricStore {
	metricStore: Store;

	constructor() {
		this.metricStore = new Store();
		this.initFP();
	}

	private initFP() {
		new PerformanceObserver((entryList) => {
			for (const entry of entryList.getEntriesByName("first-paint")) {
				this.metricStore.set(PerformanceMetric.FP, entry.startTime);
			}
		}).observe({ type: "paint", buffered: true });
	}
}

export default PerformanceMetricStore;
