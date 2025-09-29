import { SyncHook } from "tapable";
import { SentinelHooks, Plugin } from "./types";
import { PerformanceMetric, MetricValue } from "../core/store/type";

class SentinelPluginSys {
	hooks: SentinelHooks = {
		performance: {},
	};
	private plugins: Plugin[] = [];

	constructor(plugins?: Plugin[]) {
		this.hooks = {
			performance: {
				afterInit: new SyncHook<Record<PerformanceMetric, MetricValue>, void>([
					"performanceMetrics",
				]),
			},
		};

		if (plugins && plugins.length) {
			this.plugins = plugins;
		}
	}
}

export default SentinelPluginSys;

// class PerformanceMetricPlugin {
// 	apply(hooks) {
// 		hooks.performance.afterInit.tap('performanceAfterInit', (metrics) => {})
// 	}
// }
