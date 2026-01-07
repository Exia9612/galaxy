import Store from "packages/sentinel/store/metric";
import { PageInformation } from "./pageInfo/types";
import SentinelReport from "packages/sentinel/report";
import SentinelPluginSys from "packages/sentinel/plugin";
import { getPageInfo } from "./pageInfo";
import { initRouterChangeRecord } from "./userBehavior/routeChange";
import { BehaviorMetric, BehaviorMetricValue } from "./types";
import {
	CustomDefineRecordMetric,
	RouterChangeMetric,
} from "./userBehavior/types";
import { BehaviorOptions } from "packages/sentinel/types";
import { pvHandler } from "./userBehavior";

class UserBehaviorManager {
	store: Store<BehaviorMetric, BehaviorMetricValue<BehaviorMetric>>;
	report: SentinelReport;
	sentinelPlugin: SentinelPluginSys;
	// 用于按照用户唯独统计行为
	// Todo: 允许用户在初始化或者上报插件前插入
	uid: string;
	options: BehaviorOptions;

	constructor({
		store,
		sentinelPlugin,
		sentinelReport,
		uid,
		options,
	}: {
		store: Store<BehaviorMetric, BehaviorMetricValue<BehaviorMetric>>;
		sentinelReport: SentinelReport;
		sentinelPlugin: SentinelPluginSys;
		uid: string;
		options: BehaviorOptions;
	}) {
		this.store = store;
		this.report = sentinelReport;
		this.sentinelPlugin = sentinelPlugin;
		this.uid = uid || "123";
		this.options = options;
	}

	init() {
		this.initPageInfo();
		this.initRCP();
		this.initPV();
	}

	initPageInfo() {
		getPageInfo((pageInfo: PageInformation) => {
			this.store.set(BehaviorMetric.PI, pageInfo);
		});
	}

	// 捕获路由跳转行为
	rcpHandler(e: Event) {
		const routerChangeMetric: RouterChangeMetric = {
			type: e.type,
			timestamp: Date.now(),
			href: window.location.href,
		};

		this.store.set(BehaviorMetric.RCR, {
			...routerChangeMetric,
		});
	}

	initRCP() {
		initRouterChangeRecord(this.rcpHandler);
	}

	initPV() {
		initRouterChangeRecord(() => {
			const pvMetric = pvHandler();
			this.store.set(BehaviorMetric.PV, {
				...pvMetric,
			});
		});
	}

	cdrHandler(data: CustomDefineRecordMetric) {
		this.store.set(BehaviorMetric.CDR, {
			...data,
		});
	}

	reportData() {}
}

export default UserBehaviorManager;
