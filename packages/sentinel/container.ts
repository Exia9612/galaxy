import PerformanceMetricManager from "./core/performance";
import UserBehaviorManager from "./core/behavior";
import { Plugin } from "./plugin/types";
import SentinelPluginSys from "./plugin";
import { createContainer, Provider, resolveContainer } from "galaxyDI";
import Store from "./store/metric";
import SentinelReport from "./report";
import { SentinelOptions } from "./types";
import PerformanceAfterInitPlugin from "./plugin/testPlugin";
import { UserInfo } from "./core/behavior/userInfo";
import { ErrorManager } from "./core/error";

function createDIContainer(options: SentinelOptions) {
	const providers: Provider[] = [
		{
			name: "store",
			useClass: Store,
		},
		{
			name: "userInfo",
			useClass: UserInfo,
			constructorArgs: {
				appId: options.appId,
			},
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
			name: "performanceMetricManager",
			useClass: PerformanceMetricManager,
			deps: ["store", "sentinelPlugin", "sentinelReport"],
		},
		{
			name: "UserBehaviorManager",
			useClass: UserBehaviorManager,
			deps: ["sentinelPlugin", "sentinelReport", "store"],
			constructorArgs: {
				options: options.behavior || 100,
			},
		},
		{
			name: "ErrorManager",
			useClass: ErrorManager,
			deps: ["store", "sentinelPlugin", "sentinelReport"],
		},
	];

	const container = resolveContainer(createContainer(providers));

	return container;
}

export const container = createDIContainer(
	// 读取配置文件
	{
		appId: "12345",
		plugins: [new PerformanceAfterInitPlugin()],
		report: {
			path: "http://localhost:3000",
			port: 3000,
		},
	},
);
