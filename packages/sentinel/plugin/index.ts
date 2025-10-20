import { SyncHook } from "tapable";
import { SentinelHooks, Plugin } from "./types";
import { PerformanceMetric, MetricValue } from "../core/store/type";

class SentinelPluginSys {
	hooks: SentinelHooks = {
		performance: {},
	};
	private plugins: Plugin[] = [];

	constructor({ plugins }: { plugins?: Plugin[] }) {
		this.hooks = {
			performance: {
				afterInit: new SyncHook<Record<PerformanceMetric, MetricValue>, void>([
					"performanceMetrics",
				]),
			},
		};

		if (plugins && plugins.length) {
			this.plugins = plugins;
			this.plugins.forEach((plugin) => {
				plugin.apply(this.hooks);
			});
		}
	}
}

export default SentinelPluginSys;
