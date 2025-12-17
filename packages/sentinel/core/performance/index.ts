import Store from "../../store/metric";
import { initFCP } from "./fcp";
import { initFP } from "./fp";
import { initLCP } from "./lcp";
import SentinelPluginSys from "../../plugin";
import SentinelReport from "../../report";
import { initFID } from "./fid";
import { DataType } from "packages/sentinel/types";
import { initrResourcePref } from "./resource";
import {
	TechnicalPerformanceMetrics,
	PerformanceMetric,
	MetricValue,
} from "./types";

interface ReportMetricData {
	metric: PerformanceMetric;
	value: any;
}
class PerformanceMetricManager {
	// DI 注入，提供插件能力
	store: Store<PerformanceMetric, MetricValue>;
	sentinelPlugin: SentinelPluginSys;
	report: SentinelReport;

	constructor({
		sentinelPlugin,
		store,
		sentinelReport,
	}: {
		sentinelPlugin: SentinelPluginSys;
		store: Store<PerformanceMetric, MetricValue>;
		sentinelReport: SentinelReport;
	}) {
		this.store = store;
		this.sentinelPlugin = sentinelPlugin;
		this.report = sentinelReport;
		this.initMetrics();
	}

	private initMetrics() {
		// beforeInit hook

		this.setFP();
		this.setFCP();
		this.setLCP();
		this.setFID();
		this.setStaticResources();

		// 	this.sentinelPlugin.hooks.performance.afterInit?.call(
		// 		this.store.getAll(),
		// 	);
	}

	private setFP() {
		initFP((fp) => {
			this.store.set(PerformanceMetric.FP, fp);
			// this.reportMetric({
			// 	metric: PerformanceMetric.FP,
			// 	value: fp,
			// });
		});
	}

	private setFCP() {
		initFCP((fcp) => {
			this.store.set(PerformanceMetric.FCP, fcp);
		});
	}

	private setLCP() {
		initLCP((lcp) => {
			this.store.set(PerformanceMetric.LCP, lcp);
		});
	}

	private setFID() {
		initFID((fid) => {
			this.store.set(PerformanceMetric.FID, fid);
		});
	}

	private setStaticResources() {
		initrResourcePref((data: TechnicalPerformanceMetrics[]) => {
			this.store.set(PerformanceMetric.STC_RES, data);
		});
	}

	private reportMetric(data: ReportMetricData) {
		this.report.report({
			type: DataType.PERFORMANCE,
			data: {
				...data,
			},
		});
	}
}

export default PerformanceMetricManager;
