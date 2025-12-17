import Store from "packages/sentinel/store/metric";
import { BehaviorMetric, BehaviorMetricValue, PageInformation } from "./types";
import SentinelReport from "packages/sentinel/report";
import SentinelPluginSys from "packages/sentinel/plugin";
import { getPageInfo } from "./pageInfo";

class UserBehaviorManager {
	store: Store<BehaviorMetric, BehaviorMetricValue>;
	report: SentinelReport;
	sentinelPlugin: SentinelPluginSys;

	constructor({
		store,
		sentinelPlugin,
		sentinelReport,
	}: {
		store: Store<BehaviorMetric, BehaviorMetricValue>;
		sentinelReport: SentinelReport;
		sentinelPlugin: SentinelPluginSys;
	}) {
		this.store = store;
		this.report = sentinelReport;
		this.sentinelPlugin = sentinelPlugin;
	}

	init() {
		this.initPageInfo();
	}

	initPageInfo() {
		getPageInfo((pageInfo: PageInformation) => {
			this.store.set(BehaviorMetric.PI, pageInfo);
		});
	}

	// 捕获路由跳转行为
	initRouterChangeRecord() {}
}

export default UserBehaviorManager;
