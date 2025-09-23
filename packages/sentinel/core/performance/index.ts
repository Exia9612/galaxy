import Store from "../store/metric";
import { PerformanceMetric } from "../store/type";
import { initFCP } from "./fcp";
import { initFP } from "./fp";
import SentinelPluginSys from "../../plugin";

class PerformanceMetricStore {
	metricStore: Store;

	constructor() {
		this.metricStore = new Store();
		this.initMetrics();
	}

	private initMetrics() {
		// beforeInit hook

		this.setFP();
		this.setFCP();

		// afterInit hook
		// queueMicrotask, 收集数据是异步的，所以需要上报数据也是异步的

		// 放在DI container
		// const sentinelPlugin = new SentinelPluginSys(options.plugins || []);

		// // 传入数据
		// sentinelPlugin.hooks.performance.afterInit?.call(this.metricStore);
	}

	private setFP() {
		initFP((fp) => {
			this.metricStore.set(PerformanceMetric.FP, fp);
		});
	}

	private setFCP() {
		initFCP((fcp) => {
			this.metricStore.set(PerformanceMetric.FCP, fcp);
		});
	}

	//LCP FID CLS TTFB
}

export default PerformanceMetricStore;
