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

	/**
	 * navigator.sendBeacon 的优点：
	 * 异步和非阻塞：navigator.sendBeacon 是异步的，它不会阻塞浏览器的其他操作。这对于性能监控来说非常重要，
	 * 因为都不希望监控的过程影响到页面的性能。在页面卸载时仍然可以发送数据：
	 * 当用户离开页面（例如关闭页面或者导航到其他页面）时，navigator.sendBeacon仍然可以发送数据。这对于捕获和上报页面卸载前的最后一些性能数据来说非常有用。
	 * 低优先级：navigator.sendBeacon 发送的请求是低优先级的，它不会影响到页面的其他网络请求。
	 * 简单易用：navigator.sendBeacon 的API非常简单，只需要提供上报的URL和数据，就可以发送请求。
	 * 缺点
	 * navigator.sendBeacon 也有一些限制。例如，它只能发送POST请求，不能发送GET请求。而且，它发送的请求没有返回值，不能接收服务器的响应。
	 * 一些旧的浏览器可能不支持 navigator.sendBeacon。因此，在使用 navigator.sendBeacon 时，需要根据实际情况进行兼容性处理。
	 */
	private sendByBeacon(data: ReportData["data"]) {
		navigator.sendBeacon(this.options.path, JSON.stringify(data));
	}

	private sendByXHR(data: ReportData["data"]) {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", this.options.path, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(data));
	}

	private sendByImage(data: ReportData["data"]) {
		const img = new Image();
		img.src =
			this.options.path +
			"?reportData=" +
			encodeURIComponent(JSON.stringify(data));
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
		const timeout = this.options.lazyReportTimeout || 1000;
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
