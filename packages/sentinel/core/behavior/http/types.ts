export interface HttpMetric {
	method: string;
	url: URL | string;
	requestTime: number;
	status: number;
	statusText: string;
	response: any;
	responseTime: number;
	duration: number;
}
