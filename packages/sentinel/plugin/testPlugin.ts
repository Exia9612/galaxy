import { SentinelHooks } from "./types";

class PerformanceAfterInitPlugin {
	constructor() {}

	apply(hooks: SentinelHooks) {
		hooks.performance.afterInit?.tap(
			"PerformanceAfterInitPlugin",
			(metrics) => {
				console.log("PerformanceAfterInitPlugin", metrics["first-paint"]);
			},
		);
	}
}

export default PerformanceAfterInitPlugin;
