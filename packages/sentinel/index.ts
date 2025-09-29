// 测试用入口文件
import { PerformanceMetric } from "./core/store/type";
import PerformanceMetricStore from "./core/performance";
import { initSentinelGlobalObj } from "./env";
import { Plugin } from "./plugin/types";
import SentinelPluginSys from "./plugin";
import { createContainer, Provider, resolveContainer } from "galaxyDI";
import Store from "./core/store/metric";
import SentinelReport from "./report";
import { SentinelOptions } from "./types";
import PerformanceAfterInitPlugin from "./plugin/testPlugin";

function init(options: SentinelOptions) {
	initSentinelGlobalObj();

	const providers: Provider[] = [
		{
			name: "perfStore",
			useClass: Store,
		},
		{
			name: "sentinelPlugin",
			useClass: SentinelPluginSys,
			constructorArgs: {
				plugins: [...(options.plugins || [])],
			},
		},
		{
			name: "sentinelReport",
			useClass: SentinelReport,
			// constructorArgs: options.report
			constructorArgs: {
				path: "http://localhost:3000",
				port: 3000,
			},
		},
		{
			name: "PerformanceMetricStore",
			useClass: PerformanceMetricStore,
			deps: ["perfStore", "sentinelPlugin", "sentinelReport"],
		},
	];

	const container = resolveContainer(createContainer(providers));

	const pms = container.get<PerformanceMetricStore>("PerformanceMetricStore");
}

init({
	plugins: [new PerformanceAfterInitPlugin()],
	report: {
		path: "http://localhost:3000",
		port: 3000,
	},
});
