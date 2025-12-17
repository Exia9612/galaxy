import Store from "../store/metric";
import { DataType } from "../types";

export interface SentinelReportOptions {
	path: string;
	port: number;
	immediateReport?: boolean;
	lazyReportTimeout?: number;
}

export interface ReportConstructorOptions extends SentinelReportOptions {
	appId: string;
}

export interface ReportConstructorType {
	options: ReportConstructorOptions;
	dataStore: Store;
}

export interface ReportData {
	type: DataType;
	data: Record<string, any>;
}
