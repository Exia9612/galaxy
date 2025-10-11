import {
	ReactiveTarget,
	ReactiveFlags,
	reactiveMap,
	readonlyMap,
} from "./types";
import { track, trigger } from "./effect";

// 检查是否为对象
export function isObject(value: any): value is object {
	return value !== null && typeof value === "object";
}

// 检查是否为数组
function isArray(value: any): value is any[] {
	return Array.isArray(value);
}

// 检查是否为函数
function isFunction(value: any): value is Function {
	return typeof value === "function";
}

// 检查是否为响应式对象
export function isReactive(value: any): boolean {
	return !!(value && value[ReactiveFlags.IS_REACTIVE]);
}

// 检查是否为只读对象
export function isReadonly(value: any): boolean {
	return !!(value && value[ReactiveFlags.IS_READONLY]);
}

// 检查是否为代理对象
export function isProxy(value: any): boolean {
	return isReactive(value) || isReadonly(value);
}

// 获取原始对象
export function toRaw<T>(observed: T): T {
	const raw = observed && (observed as any)[ReactiveFlags.RAW];
	return raw ? toRaw(raw) : observed;
}

// 创建响应式代理
function createReactiveObject(
	target: ReactiveTarget,
	isReadonly: boolean,
	baseHandlers: ProxyHandler<any>,
) {
	if (!isObject(target)) {
		console.warn(`value cannot be made reactive: ${String(target)}`);
		return target;
	}

	// 如果已经是代理对象，直接返回
	if (
		target[ReactiveFlags.RAW] &&
		!(isReadonly && target[ReactiveFlags.IS_REACTIVE])
	) {
		return target;
	}

	// 检查缓存
	const proxyMap = isReadonly ? readonlyMap : reactiveMap;
	const existingProxy = proxyMap.get(target);
	if (existingProxy) {
		return existingProxy;
	}

	// 创建代理
	const proxy = new Proxy(target, baseHandlers);
	proxyMap.set(target, proxy);
	return proxy;
}

// 响应式处理器
const reactiveHandlers: ProxyHandler<ReactiveTarget> = {
	get(target: ReactiveTarget, key: string | symbol, receiver: any) {
		// 特殊标记
		if (key === ReactiveFlags.IS_REACTIVE) {
			return true;
		}
		if (key === ReactiveFlags.IS_READONLY) {
			return false;
		}
		if (key === ReactiveFlags.RAW) {
			return target;
		}

		const res = Reflect.get(target, key, receiver);

		// 收集依赖
		track(target, key);

		// 如果值是对象，递归转换为响应式
		if (isObject(res)) {
			return reactive(res);
		}

		return res;
	},

	set(target: ReactiveTarget, key: string | symbol, value: any, receiver: any) {
		const oldValue = (target as any)[key];
		const result = Reflect.set(target, key, value, receiver);

		// 触发更新
		if (oldValue !== value) {
			trigger(target, key);
		}

		return result;
	},

	deleteProperty(target: ReactiveTarget, key: string | symbol) {
		const hadKey = Object.prototype.hasOwnProperty.call(target, key);
		const result = Reflect.deleteProperty(target, key);

		if (result && hadKey) {
			trigger(target, key);
		}

		return result;
	},

	has(target: ReactiveTarget, key: string | symbol) {
		const result = Reflect.has(target, key);
		track(target, key);
		return result;
	},

	ownKeys(target: ReactiveTarget) {
		track(target, isArray(target) ? "length" : "ITERATE_KEY");
		return Reflect.ownKeys(target);
	},
};

// 只读处理器
const readonlyHandlers: ProxyHandler<ReactiveTarget> = {
	get(target: ReactiveTarget, key: string | symbol, receiver: any) {
		if (key === ReactiveFlags.IS_REACTIVE) {
			return false;
		}
		if (key === ReactiveFlags.IS_READONLY) {
			return true;
		}
		if (key === ReactiveFlags.RAW) {
			return target;
		}

		const res = Reflect.get(target, key, receiver);

		// 只读对象不收集依赖，但递归转换
		if (isObject(res)) {
			return readonly(res);
		}

		return res;
	},

	set(target: ReactiveTarget, key: string | symbol, value: any, receiver: any) {
		console.warn(
			`Set operation on key "${String(key)}" failed: target is readonly.`,
			target,
		);
		return true;
	},

	deleteProperty(target: ReactiveTarget, key: string | symbol) {
		console.warn(
			`Delete operation on key "${String(key)}" failed: target is readonly.`,
			target,
		);
		return true;
	},
};

// 创建响应式对象
export function reactive<T extends object>(target: T): T {
	return createReactiveObject(target, false, reactiveHandlers);
}

// 创建只读对象
export function readonly<T extends object>(target: T): T {
	return createReactiveObject(target, true, readonlyHandlers);
}

// 浅响应式
export function shallowReactive<T extends object>(target: T): T {
	return createReactiveObject(target, false, {
		...reactiveHandlers,
		get(target: ReactiveTarget, key: string | symbol, receiver: any) {
			if (key === ReactiveFlags.IS_REACTIVE) {
				return true;
			}
			if (key === ReactiveFlags.IS_READONLY) {
				return false;
			}
			if (key === ReactiveFlags.RAW) {
				return target;
			}

			const res = Reflect.get(target, key, receiver);
			track(target, key);
			return res; // 不递归转换
		},
	});
}

// 浅只读
export function shallowReadonly<T extends object>(target: T): T {
	return createReactiveObject(target, true, {
		...readonlyHandlers,
		get(target: ReactiveTarget, key: string | symbol, receiver: any) {
			if (key === ReactiveFlags.IS_REACTIVE) {
				return false;
			}
			if (key === ReactiveFlags.IS_READONLY) {
				return true;
			}
			if (key === ReactiveFlags.RAW) {
				return target;
			}

			const res = Reflect.get(target, key, receiver);
			return res; // 不递归转换
		},
	});
}
