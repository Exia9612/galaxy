import { BehaviorMetric } from "../types";
import { UserInfoMetric } from "../userInfo/types";

export interface RouterChangeMetric {
	type: string;
	timestamp: number;
	href: string;
}

export interface UserBehaviorMetric {
	type: Omit<BehaviorMetric, BehaviorMetric.PI>;
	data: RouterChangeMetric;
}

export interface PVMetric extends UserInfoMetric {
	timeStamp: number;
	href: string;
}

export interface CustomDefineRecordMetric {
	eventType: string;
	value: any;
}
