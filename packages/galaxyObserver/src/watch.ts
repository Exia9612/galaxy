import { ReactiveEffect } from "./effect";
import { isObject } from "./utils";
import { unRef } from "./ref";

// watch 选项接口
export interface WatchOptions {
	immediate?: boolean; // 是否立即执行
	deep?: boolean; // 是否深度监听
	flush?: "pre" | "post" | "sync"; // 执行时机
	onTrack?: (event: any) => void;
	onTrigger?: (event: any) => void;
}

// watch 回调函数类型
export type WatchCallback<V = any, OV = any> = (
	value: V,
	oldValue: OV,
	onInvalidate: OnInvalidate,
) => any;

// 清理函数类型
export type OnInvalidate = (fn: () => void) => void;

// watch 源类型
export type WatchSource<T = any> = (() => T) | T;

// 深度遍历对象，收集所有属性
function traverse(value: any, seen: Set<any> = new Set()): any {
	if (!isObject(value) || seen.has(value)) {
		return value;
	}

	seen.add(value);

	if (Array.isArray(value)) {
		for (let i = 0; i < value.length; i++) {
			traverse(value[i], seen);
		}
	} else {
		for (const key in value) {
			traverse(value[key], seen);
		}
	}

	return value;
}

// 获取watch源的值
function getWatchSourceValue(source: WatchSource) {
	// 如果是函数 → 执行函数获取值
	if (typeof source === "function") {
		return source();
	}
	// 如果是 ref → 调用 unRef() 获取值
	return unRef(source);
}

// 创建watch实例
class WatchEffect {
	private effect: ReactiveEffect;
	private cleanup: (() => void) | undefined;
	private onInvalidate: OnInvalidate;

	constructor(
		private source: WatchSource,
		private callback: WatchCallback,
		private options: WatchOptions = {},
	) {
		this.onInvalidate = (fn: () => void) => {
			this.cleanup = fn;
		};

		// 创建effect
		this.effect = new ReactiveEffect(
			() => {
				// 如果是深度监听，需要遍历整个对象
				if (this.options.deep) {
					traverse(getWatchSourceValue(this.source));
				} else {
					getWatchSourceValue(this.source);
				}
			},
			{
				scheduler: () => {
					this.run();
				},
				onTrack: this.options.onTrack,
				onTrigger: this.options.onTrigger,
			},
		);

		// 如果设置了immediate，立即执行一次
		if (this.options.immediate) {
			this.run();
		} else {
			// 否则先执行一次收集依赖，并保存初始值
			const initialValue = getWatchSourceValue(this.source);
			this.effect._oldValue = initialValue;
			this.effect.run();
		}
	}

	private run() {
		const newValue = getWatchSourceValue(this.source);
		const oldValue = this.effect._oldValue;

		// 清理之前的清理函数
		if (this.cleanup) {
			this.cleanup();
			this.cleanup = undefined;
		}

		// 执行回调
		this.callback(newValue, oldValue, this.onInvalidate);

		// 保存当前值作为下次的旧值
		this.effect._oldValue = newValue;
	}

	stop() {
		this.effect.stop();
		if (this.cleanup) {
			this.cleanup();
		}
	}
}

// 主要的watch函数
export function watch<T = any>(
	source: WatchSource<T>,
	callback: WatchCallback<T>,
	options: WatchOptions = {},
): () => void {
	// 创建watch实例
	const watchEffect = new WatchEffect(source, callback, options);

	// 返回停止函数
	return () => watchEffect.stop();
}

// 在每次响应式状态发生变化时触发回调函数
// watchEffect函数 - 自动收集依赖
export function watchEffect(
	effect: (onInvalidate: OnInvalidate) => void,
	options: Omit<WatchOptions, "immediate" | "deep"> = {},
): () => void {
	let cleanup: (() => void) | undefined;

	const onInvalidate: OnInvalidate = (fn: () => void) => {
		cleanup = fn;
	};

	const reactiveEffect = new ReactiveEffect(
		() => {
			// 清理之前的清理函数
			if (cleanup) {
				cleanup();
				cleanup = undefined;
			}

			// 执行effect函数
			effect(onInvalidate);
		},
		{
			scheduler: () => {
				reactiveEffect.run();
			},
			onTrack: options.onTrack,
			onTrigger: options.onTrigger,
		},
	);

	// 立即执行一次
	reactiveEffect.run();

	// 返回停止函数
	return () => {
		reactiveEffect.stop();
		if (cleanup) {
			cleanup();
		}
	};
}

// 监听多个源
export function watchMultiple<T extends readonly unknown[]>(
	sources: [...{ [K in keyof T]: WatchSource<T[K]> }],
	callback: (values: T, oldValues: T, onInvalidate: OnInvalidate) => any,
	options: WatchOptions = {},
): () => void {
	let oldValues: T;

	const stopWatchers = sources.map((source, index) => {
		return watch(
			source,
			(newValue, oldValue, onInvalidate) => {
				const newValues = [...(oldValues || [])] as unknown as T;
				const oldValuesCopy = [...(oldValues || [])] as unknown as T;

				(newValues as any)[index] = newValue;
				(oldValuesCopy as any)[index] = oldValue;

				callback(newValues, oldValuesCopy, onInvalidate);
				oldValues = newValues;
			},
			options,
		);
	});

	// 返回停止所有监听的函数
	return () => {
		stopWatchers.forEach((stop) => stop());
	};
}
