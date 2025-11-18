import { Plugin } from "./plugin/types";
import { SentinelReportOptions } from "./report/types";

export interface SentinelOptions {
	appId: string;
	plugins?: Plugin[];
	report: SentinelReportOptions;
}

export enum DataType {
	PERFORMANCE = "performance",
	BEHAVIOR = "behavior",
	ERROR = "error",
	RESOURCE = "resource",
	OTHER = "other",
}
