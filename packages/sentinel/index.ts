// 测试用入口文件
import PerformanceMetricStore from "./core/performance/metric";
import { PerformanceMetric } from "./core/performance/type";

const metricStore = new PerformanceMetricStore();

metricStore.set(PerformanceMetric.FP, 100);

console.log(metricStore.get(PerformanceMetric.FP));
