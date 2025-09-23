// type Hook = (...args: any) => void;
// type IKernelPlugin<T extends string | symbol> = Record<T, Hook[]>;
// type IPlugin<T extends string | symbol> = Partial<Record<T, Hook | Hook[]>>;

// class PluginSystem<K extends string> {
// 	/* hook 是
// 		{
// 			string: (...) => vpid
// 		}
// 	*/
//   private hooks: IKernelPlugin<K>;

//   constructor(hooks: K[] = []) {
// 		// 实参hooks = string[]
//     invariant(hooks.length, `plugin.hooks cannot be empty`);

// 		// 构建了一个只有hook名称，但hooks列表是空的
//     this.hooks = hooks.reduce((memo, key) => {
//       memo[key] = [];
//       return memo;
//     }, {} as IKernelPlugin<K>);
//   }

// 	// 注册插件
//   use(plugin: IPlugin<K>) {
//     const { hooks } = this;
//     for (let key in plugin) {
//       if (Object.prototype.hasOwnProperty.call(plugin, key)) {
//         invariant(hooks[key], `plugin.use: unknown plugin property: ${key}`);
//         hooks[key] = hooks[key].concat(plugin[key]);
//       }
//     }
//   }

// 	// 调用插件
//   apply(key: K, defaultHandler: Hook = () => {}) {
//     const { hooks } = this;
//     const fns = hooks[key];

//     return (...args: any) => {
//       if (fns.length) {
//         for (const fn of fns) {
//           fn(...args);
//         }
//       } else {
//         defaultHandler(...args);
//       }
//     };
//   }

//   get(key: K) {
//     const { hooks } = this;
//     invariant(key in hooks, `plugin.get: hook ${key} cannot be got`);

//     return hooks[key];
//   }
// }

// export default PluginSystem;

import { SyncHook } from "tapable";
import { SentinelAllHooks, SentinelHooks, Plugin } from "./types";

class SentinelPluginSys {
	hooks: SentinelHooks = {
		performance: {},
	};
	private plugins: Plugin[] = [];

	constructor(plugins: Plugin[]) {
		this.hooks = {
			performance: {
				afterInit: new SyncHook(["performanceMetrics"]),
			},
		};

		if (plugins.length) {
			this.plugins = plugins;
		}
	}

	//挂载
	use() {
		this.plugins.forEach((plugin) => plugin.apply(this.hooks));
	}
}

export default SentinelPluginSys;

// class PerformanceMetricPlugin {
// 	apply(hooks) {
// 		hooks.performance.afterInit.tap('performanceAfterInit', (metrics) => {})
// 	}
// }
