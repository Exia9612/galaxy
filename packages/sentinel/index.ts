// 测试用入口文件
import { PerformanceMetric } from "./core/store/type";
import PerformanceMetricStore from "./core/performance";
import { initGlobalSentinel } from "./env";

const pms = new PerformanceMetricStore();

console.log("=======================", pms.metricStore);
console.log("-----------", pms.metricStore.get(PerformanceMetric.FP));

function init() {
	initGlobalSentinel();
}

init();
