import { SentinelReportOptions } from "./types";

class SentinelReport<T = Record<string, any>> {
	options: SentinelReportOptions;
	reportData: T;

	constructor(options: SentinelReportOptions) {
		this.options = options;
		this.reportData = {} as T;
	}

	setReportData(data: T) {
		this.reportData = data;
	}

	// 上报数据
	report() {}

	// 测试用
	print() {
		console.log(this.reportData);
	}
}

export default SentinelReport;
