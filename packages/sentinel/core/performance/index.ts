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
		perfStore,
		sentinelReport,
	}: {
		sentinelPlugin: SentinelPluginSys;
		perfStore: Store;
		sentinelReport: SentinelReport;
	}) {
		this.store = perfStore;
		this.sentinelPlugin = sentinelPlugin;
		this.sentinelReport = sentinelReport;
		this.initMetrics();
	}

	private initMetrics() {
		// beforeInit hook

		// this.setFP();
		// this.setFCP();

		Promise.all([this.setFP(), this.setFCP()]).then((res) => {
			console.log("======execute Promise.all=========", res);
			console.log("======execute queueMicrotask=========", this.store.getAll());
		});

		// afterInit hook
		// queueMicrotask, 收集数据是异步的，所以需要上报数据也是异步的
		// queueMicrotask(() => {
		// 	console.log("======execute queueMicrotask=========", this.store.getAll());
		// 	this.sentinelPlugin.hooks.performance.afterInit?.call(
		// 		this.store.getAll(),
		// 	);
		// });
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
