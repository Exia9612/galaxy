import Store from "./metric";
import { PerformanceMetric } from "./type";

class PerformanceMetricStore {
	metricStore: Store;

	constructor() {
		this.metricStore = new Store();
		this.afterLoad(() => {
			this.initFP();
		});
	}

	private afterLoad = (callback: any) => {
		if (document.readyState === "complete") {
			setTimeout(callback);
		} else {
			window.addEventListener("pageshow", callback, {
				once: true,
				capture: true,
			});
		}
	};

	private initFP() {
		new PerformanceObserver((entryList) => {
			for (const entry of entryList.getEntriesByName("first-paint")) {
				this.metricStore.set(PerformanceMetric.FP, entry.startTime);
			}
		}).observe({ type: "paint", buffered: true });
	}
}

export default PerformanceMetricStore;
