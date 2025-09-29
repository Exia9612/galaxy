import { Plugin } from "./plugin/types";
import { SentinelReportOptions } from "./report/types";

export interface SentinelOptions {
	plugins?: Plugin[];
	report: SentinelReportOptions;
}
