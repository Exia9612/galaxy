import Store from "../../store/metric";
import { initFCP } from "./fcp";
import { initFP } from "./fp";
import { initLCP } from "./lcp";
import SentinelPluginSys from "../../plugin";
import SentinelReport from "../../report";
import { initFID } from "./fid";
import { DataType } from "@sentinel/types";
import { initrResourcePref } from "./resource";
import {
	TechnicalPerformanceMetrics,
	PerformanceMetric,
	MetricValue,
} from "./types";

/**
 * SPA和MPA的性能监控
 * SPA只需要监控首屏性能，路由切换并不会更新性能指标
 * MPA需要监控所有性能指标，因为路由切换会更新性能指标
 *
 * 阿里ams文档：https://help.aliyun.com/zh/arms/browser-monitoring/support/frontend-monitoring-faq?scm=20140722.S_help%40%40%E6%96%87%E6%A1%A3%40%4074801._.ID_help%40%40%E6%96%87%E6%A1%A3%40%4074801-RL_SPA-LOC_doc%7EUND%7Eab-OR_ser-PAR1_2102029c17660241886608709daf5c-V_4-PAR3_r-RE_new5-P0_1-P1_0&spm=a2c4g.11186623.help-search.i58
 * https://github.com/forthealllight/blog/issues/38
 */

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
