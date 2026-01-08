import { PageInformation } from "./pageInfo/types";
import { UserAgentInfo } from "./userAgent/types";
import {
	CustomDefineRecordMetric,
	PVMetric,
	RouterChangeMetric,
} from "./userBehavior/types";
import { UserOriginInfo } from "./userOrigin/types";

// 行为监控分成下面6类
export enum BehaviorMetric {
	PI = "page-information", // 页面信息
	OI = "origin-information", // 来源信息
	RCR = "router-change-record", // 路由变化记录
	CDR = "custom-define-record", // 自定义定义记录
	HT = "http-record", // HTTP 记录
	PV = "PV", // 页面访问量
	UA = "user-agent-information", // 用户代理信息
}

export type BehaviorMetricValue<T extends BehaviorMetric> =
	T extends BehaviorMetric.PI
		? PageInformation
		: T extends BehaviorMetric.RCR
			? RouterChangeMetric
			: T extends BehaviorMetric.PV
				? PVMetric
				: T extends BehaviorMetric.CDR
					? CustomDefineRecordMetric
					: T extends BehaviorMetric.OI
						? UserOriginInfo
						: T extends BehaviorMetric.UA
							? UserAgentInfo
							: never;
