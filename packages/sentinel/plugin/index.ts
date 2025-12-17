import { SyncHook } from "tapable";
import { SentinelHooks, Plugin } from "./types";
import { PerformanceMetric, MetricValue } from "../core/performance/types";

class SentinelPluginSys {
	hooks: SentinelHooks = {
		performance: {},
	};
	private plugins: Plugin[] = [];

	constructor({ plugins }: { plugins?: Plugin[] }) {
		// sentinel提供的hook
		this.hooks = {
			performance: {
				afterInit: new SyncHook<Record<PerformanceMetric, MetricValue>, void>([
					"performanceMetrics",
				]),
			},
		};

		// 用户定义的钩子
		if (plugins && plugins.length) {
			this.plugins = plugins;
			this.plugins.forEach((plugin) => {
				plugin.apply(this.hooks);
			});
		}
	}
}

export default SentinelPluginSys;
