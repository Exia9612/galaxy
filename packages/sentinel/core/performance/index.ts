import Store from "../store/metric";
import { PerformanceMetric } from "../store/type";
import { initFCP } from "./fcp";
import { initFP } from "./fp";
import SentinelPluginSys from "../../plugin";
import SentinelReport from "packages/sentinel/report";

class PerformanceMetricStore {
	store: Store;
	// DI 注入，提供插件能力
	sentinelPlugin: SentinelPluginSys;
	sentinelReport: SentinelReport;

	constructor({
		sentinelPlugin,
		store,
		sentinelReport,
	}: {
		sentinelPlugin: SentinelPluginSys;
		store: Store;
		sentinelReport: SentinelReport;
	}) {
		this.store = store;
		this.sentinelPlugin = sentinelPlugin;
		this.sentinelReport = sentinelReport;
		this.initMetrics();
	}

	private initMetrics() {
		// beforeInit hook

		this.setFP();
		this.setFCP();

		// afterInit hook
		// queueMicrotask, 收集数据是异步的，所以需要上报数据也是异步的
		queueMicrotask(() => {
			this.sentinelPlugin.hooks.performance.afterInit?.call(
				this.store.getAll(),
			);
		});

		// 放在DI container
		// const sentinelPlugin = new SentinelPluginSys(options.plugins || []);
	}

	private setFP() {
		initFP((fp) => {
			this.store.set(PerformanceMetric.FP, fp);
		});
	}

	private setFCP() {
		initFCP((fcp) => {
			this.store.set(PerformanceMetric.FCP, fcp);
		});
	}

	//LCP FID CLS TTFB
}

export default PerformanceMetricStore;
