import { Plugin } from "./plugin/types";
import { SentinelReportOptions } from "./report/types";

export interface BehaviorOptions {
	maxBehaviorStack?: number;
}
export interface SentinelOptions {
	appId: string;
	plugins?: Plugin[];
	report: SentinelReportOptions;
	behavior?: BehaviorOptions;
}

export enum DataType {
	PERFORMANCE = "performance",
	BEHAVIOR = "behavior",
	ERROR = "error",
	RESOURCE = "resource",
	OTHER = "other",
}
