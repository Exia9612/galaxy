import { WatchCallback, WatchOptions, ReactiveEffect, Ref } from "./types";
import { createReactiveEffect, stop } from "./effect";
import { isRef, unref } from "./ref";
import { isReactive, toRaw, isObject } from "./reactive";

// 监听器函数类型
type WatchSource<T = any> = (() => T) | Ref<T>;

// 监听器源数组类型
type WatchSourceArray<T extends readonly unknown[]> = {
	[K in keyof T]: WatchSource<T[K]>;
};

// 监听器回调数组类型
type WatchCallbackArray<T extends readonly unknown[]> = (
	values: { [K in keyof T]: T[K] },
	oldValues: { [K in keyof T]: T[K] },
	onInvalidate: (fn: () => void) => void,
) => any;

// 获取监听源的值
function getValue(source: WatchSource): any {
	if (isRef(source)) {
		return source.value;
	} else if (typeof source === "function") {
		return source();
	} else {
		return source;
	}
}

// 深度遍历对象收集依赖
function traverse(value: any, seen: Set<any> = new Set()): any {
	if (!isObject(value) || seen.has(value)) {
		return value;
	}

	seen.add(value);

	if (isRef(value)) {
		traverse(value.value, seen);
	} else if (Array.isArray(value)) {
		for (let i = 0; i < value.length; i++) {
			traverse(value[i], seen);
		}
	} else if (value instanceof Map) {
		value.forEach((v, k) => {
			traverse(v, seen);
			traverse(k, seen);
		});
	} else if (value instanceof Set) {
		value.forEach((v) => {
			traverse(v, seen);
		});
	} else {
		for (const key in value) {
			traverse(value[key], seen);
		}
	}

	return value;
}

// 创建监听器
export function watch<T = any>(
	source: WatchSource<T>,
	callback: WatchCallback<T>,
	options?: WatchOptions,
): () => void;

export function watch<T extends readonly unknown[]>(
	sources: WatchSourceArray<T>,
	callback: WatchCallbackArray<T>,
	options?: WatchOptions,
): () => void;

export function watch<T = any>(
	source: WatchSource<T> | WatchSourceArray<T>,
	callback: WatchCallback<T> | WatchCallbackArray<T>,
	options: WatchOptions = {},
): () => void {
	const { immediate = false, deep = false, flush = "pre" } = options;

	let getter: () => any;
	let isMultiSource = false;

	// 处理监听源
	if (Array.isArray(source)) {
		isMultiSource = true;
		getter = () => source.map((s) => getValue(s));
	} else {
		getter = () => getValue(source);
	}

	// 深度监听
	if (deep) {
		const baseGetter = getter;
		getter = () => traverse(baseGetter());
	}

	let oldValue: any;
	let cleanup: (() => void) | undefined;

	// 清理函数
	function onInvalidate(fn: () => void) {
		cleanup = fn;
	}

	// 调度函数
	function job() {
		const newValue = getter();

		// 检查值是否改变
		if (hasChanged(newValue, oldValue)) {
			if (cleanup) {
				cleanup();
				cleanup = undefined;
			}

			if (isMultiSource) {
				(callback as WatchCallbackArray<any>)(newValue, oldValue, onInvalidate);
			} else {
				(callback as WatchCallback<any>)(newValue, oldValue, onInvalidate);
			}

			oldValue = newValue;
		}
	}

	// 创建effect
	const effect = createReactiveEffect(getter, job);

	// 立即执行
	if (immediate) {
		job();
	} else {
		oldValue = getter();
	}

	// 返回停止函数
	return () => stop(effect);
}

// 检查值是否改变
function hasChanged(value: any, oldValue: any): boolean {
	return !Object.is(value, oldValue);
}

// 监听effect
export function watchEffect(
	effect: (onInvalidate: (fn: () => void) => void) => void,
	options?: { flush?: "pre" | "post" | "sync" },
): () => void {
	let cleanup: (() => void) | undefined;

	function onInvalidate(fn: () => void) {
		cleanup = fn;
	}

	const _effect = createReactiveEffect(() => {
		if (cleanup) {
			cleanup();
			cleanup = undefined;
		}
		effect(onInvalidate);
	});

	_effect();

	return () => stop(_effect);
}

// 监听ref
export function watchRef<T = any>(
	source: WatchSource<T>,
	options?: WatchOptions,
): { value: T; stop: () => void } {
	let value = getValue(source);
	let stopWatcher: (() => void) | undefined;

	const ref = {
		get value() {
			return value;
		},
		set value(newValue: T) {
			value = newValue;
		},
		stop: () => {
			if (stopWatcher) {
				stopWatcher();
				stopWatcher = undefined;
			}
		},
	};

	stopWatcher = watch(
		source,
		(newValue) => {
			value = newValue;
		},
		options,
	);

	return ref;
}
