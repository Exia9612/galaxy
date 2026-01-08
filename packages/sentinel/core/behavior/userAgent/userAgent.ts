import Bowser from "bowser";
import { UserAgentInfo } from "./types";

export function getUAFeature(userAgent: string): UserAgentInfo {
	const browserData = Bowser.parse(userAgent);
	const browserName = browserData.browser.name; // 浏览器名
	const browserVersion = browserData.browser.version; // 浏览器版本号
	const osName = browserData.os.name; // 操作系统名
	const osVersion = browserData.os.version; // 操作系统版本号
	const deviceType = browserData.platform.type; // 设备类型
	const deviceVendor = browserData.platform.vendor || ""; // 设备所属公司
	const deviceModel = browserData.platform.model || ""; // 设备型号
	const engineName = browserData.engine.name; // engine名
	const engineVersion = browserData.engine.version; // engine版本号
	return {
		browserName,
		browserVersion,
		osName,
		osVersion,
		deviceType,
		deviceVendor,
		deviceModel,
		engineName,
		engineVersion,
	};
}
