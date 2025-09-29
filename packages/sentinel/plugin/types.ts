import { SyncHook } from "tapable";
import { PerformanceMetric, MetricValue } from "../core/store/type";

export interface SentinelAllHooks {
	beforeInit: SyncHook<void>;
	afterInit: SyncHook<Record<PerformanceMetric, MetricValue>, void>;
	// beforeSendData
	// afterSendData
}

export interface SentinelHooks {
	performance: Partial<SentinelAllHooks>;
	// behavior
	// err
}

export interface Plugin {
	apply: (hooks: SentinelHooks) => void;
}
