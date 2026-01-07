// 测试用入口文件
import PerformanceMetricManager from "./core/performance";
import { initSentinelGlobalObj } from "./env";
import { container } from "./container";
import UserBehaviorManager from "./core/behavior";

function init() {
	const pms = container.get<PerformanceMetricManager>(
		"PerformanceMetricManager",
	);

	const userBehaviorManager = container.get<UserBehaviorManager>(
		"UserBehaviorManager",
	);

	initSentinelGlobalObj();

	window.__SENTINEL__.cdrReport = userBehaviorManager.cdrHandler;
}

init();
