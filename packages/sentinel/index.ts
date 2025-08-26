// 测试用入口文件
import { PerformanceMetric } from "./core/performance/type";
import PerformanceMetricStore from "./core/performance";

const pms = new PerformanceMetricStore();

console.log("=======================", pms.metricStore);
console.log("-----------", pms.metricStore.get(PerformanceMetric.FP));
