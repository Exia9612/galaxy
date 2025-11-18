import {
	ReportConstructorType,
	ReportConstructorOptions,
	ReportData,
} from "./types";
import { DataType } from "../types";

class SentinelReport {
	options: ReportConstructorOptions;
	store: Map<DataType, Record<string, any>>;

	constructor({ options }: ReportConstructorType) {
		this.options = options;
		this.store = new Map();
	}

	private sendByBeacon(data: ReportData["data"]) {
		navigator.sendBeacon(this.options.path, JSON.stringify(data));
	}

	private sendByXHR(data: ReportData["data"]) {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", this.options.path, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(data));
	}

	private send(data: ReportData["data"]) {
		// @ts-expect-error - navigator may not exist in all environments
		if (navigator && navigator.sendBeacon) {
			this.sendByBeacon(data);
		} else {
			this.sendByXHR(data);
		}
	}

	private lazyReport(data: ReportData) {
		const timeout = this.options.lazyReportTimeout || 3000;
		const { type } = data;

		if (!this.store.has(type)) {
			this.store.set(type, data.data);
		} else {
			this.store.set(type, {
				...this.store.get(type),
				...data.data,
			});
		}

		setTimeout(() => {
			for (const [type, data] of this.store.entries()) {
				this.send({
					type,
					...data,
				});
			}
		}, timeout);
	}

	report(data: ReportData) {
		const immediateReport = this.options.immediateReport || false;
		const reportData = {
			type: data.type,
			...data.data,
		};

		if (immediateReport) {
			this.send(reportData);
		}

		if (window.requestIdleCallback) {
			window.requestIdleCallback(() => {
				this.send(reportData);
			});
		} else {
			this.lazyReport(data);
		}
	}
}

export default SentinelReport;
