import { SyncHook } from "tapable";

export interface SentinelAllHooks {
	beforeInit: SyncHook<void>;
	afterInit: SyncHook<void>;
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
