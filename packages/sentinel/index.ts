// 测试用入口文件
import PerformanceMetricManager from "./core/performance";
import UserBehaviorManager from "./core/behavior";
import UserBehavior from "./core/behavior/behavior";
import { initSentinelGlobalObj } from "./env";
import { Plugin } from "./plugin/types";
import SentinelPluginSys from "./plugin";
import { createContainer, Provider, resolveContainer } from "galaxyDI";
import Store from "./store/metric";
import SentinelReport from "./report";
import { SentinelOptions } from "./types";
import PerformanceAfterInitPlugin from "./plugin/testPlugin";

function init(options: SentinelOptions) {
	initSentinelGlobalObj();

	const providers: Provider[] = [
		{
			name: "Store",
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
			constructorArgs: {
				options: {
					...options.report,
					appId: options.appId,
				},
			},
		},
		{
			name: "PerformanceMetricManager",
			useClass: PerformanceMetricManager,
			deps: ["Store", "sentinelPlugin", "sentinelReport"],
		},
		{
			name: "UserBehaviorManager",
			useClass: UserBehaviorManager,
			deps: ["sentinelPlugin", "sentinelReport", "Store"],
		},
		{
			name: "UserBehavior",
			useClass: UserBehavior,
			deps: ["Store"],
		},
	];

	const container = resolveContainer(createContainer(providers));

	const pms = container.get<PerformanceMetricManager>(
		"PerformanceMetricManager",
	);
}

init({
	appId: "12345",
	plugins: [new PerformanceAfterInitPlugin()],
	report: {
		path: "http://localhost:3000",
		port: 3000,
	},
});
