import Store from "../store/metric";
import { PerformanceMetric } from "../store/type";
import { initFCP } from "./fcp";
import { initFP } from "./fp";
import { initLCP } from "./lcp";
import SentinelPluginSys from "../../plugin";
import SentinelReport from "../../report";
import { DataType } from "../../types";

class PerformanceMetricStore {
	store: Store;
	// DI 注入，提供插件能力
	sentinelPlugin: SentinelPluginSys;
	report: SentinelReport;

	constructor({
		sentinelPlugin,
		perfStore,
		sentinelReport,
	}: {
		sentinelPlugin: SentinelPluginSys;
		perfStore: Store;
		sentinelReport: SentinelReport;
	}) {
		this.store = perfStore;
		this.sentinelPlugin = sentinelPlugin;
		this.report = sentinelReport;
		this.initMetrics();
	}

	private initMetrics() {
		// beforeInit hook

		this.setFP();
		this.setFCP();
		this.setLCP();

		// 	this.sentinelPlugin.hooks.performance.afterInit?.call(
		// 		this.store.getAll(),
		// 	);
	}

	private setFP() {
		initFP((fp) => {
			this.store.set(PerformanceMetric.FP, fp);
			// this.report.report({
			// 	type: DataType.PERFORMANCE,
			// 	data: {
			// 		[PerformanceMetric.FP]: fp,
			// 	},
			// });
		});
	}

	private setFCP() {
		initFCP((fcp) => {
			this.store.set(PerformanceMetric.FCP, fcp);
			// this.report.report({
			// 	type: DataType.PERFORMANCE,
			// 	data: {
			// 		[PerformanceMetric.FCP]: fcp,
			// 	},
			// });
		});
	}

	private setLCP() {
		initLCP((lcp) => {
			this.store.set(PerformanceMetric.LCP, lcp);
		});
	}

	//FID CLS TTFB
}

export default PerformanceMetricStore;
