// 测试用入口文件
import { PerformanceMetric } from "./core/store/type";
import PerformanceMetricStore from "./core/performance";
import { initSentinelGlobalObj } from "./env";
import { Plugin } from "./plugin/types";
import SentinelPluginSys from "./plugin";

const pms = new PerformanceMetricStore();

console.log("=======================", pms.metricStore);
console.log("-----------", pms.metricStore.get(PerformanceMetric.FP));

interface Options {
	plugins?: Plugin[];
}

function init(options: Options) {
	initSentinelGlobalObj();
}

init({});
