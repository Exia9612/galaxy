import {
	ReactiveEffect,
	isTracking,
	trackEffects,
	triggerEffects,
} from "./effect";

// computed 选项接口
export interface ComputedOptions {
	lazy?: boolean; // 是否懒加载
}

// computed getter 函数类型
export type ComputedGetter<T> = () => T;

// computed setter 函数类型
export type ComputedSetter<T> = (value: T) => void;

// computed 函数重载
export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>;
export function computed<T>(options: {
	get: ComputedGetter<T>;
	set: ComputedSetter<T>;
}): ComputedRef<T>;

// computed 实现
export function computed<T>(
	getterOrOptions:
		| ComputedGetter<T>
		| { get: ComputedGetter<T>; set: ComputedSetter<T> },
): ComputedRef<T> {
	let getter: ComputedGetter<T>;
	let setter: ComputedSetter<T> | undefined;

	// 判断参数类型
	if (isFunction(getterOrOptions)) {
		getter = getterOrOptions;
	} else {
		getter = getterOrOptions.get;
		setter = getterOrOptions.set;
	}

	return new ComputedRefImpl(getter, setter);
}

// ComputedRef 接口
export interface ComputedRef<T = any> {
	readonly value: T;
}

// ComputedRef 实现类
class ComputedRefImpl<T> implements ComputedRef<T> {
	private _value!: T;
	private _dirty = true; // 标记是否需要重新计算
	private _effect: ReactiveEffect;

	constructor(
		getter: ComputedGetter<T>,
		private _setter?: ComputedSetter<T>,
	) {
		// 创建effect，用于收集依赖
		this._effect = new ReactiveEffect(getter, {
			lazy: true, // 懒加载，不立即执行
			scheduler: () => {
				// 当依赖变化时，标记为脏数据
				if (!this._dirty) {
					this._dirty = true;
					// 触发依赖此computed的effect
					triggerRefValue(this);
				}
			},
		});
	}

	get value() {
		// 收集依赖
		trackRefValue(this);

		// 如果是脏数据，重新计算
		if (this._dirty) {
			this._dirty = false;
			this._value = this._effect.run();
		}

		return this._value;
	}

	set value(newValue: T) {
		if (this._setter) {
			this._setter(newValue);
		} else {
			console.warn("Write operation failed: computed value is readonly");
		}
	}
}

// 用于跟踪computed的依赖
const computedRefs = new WeakMap<ComputedRefImpl<any>, Set<ReactiveEffect>>();

// 跟踪computed的依赖
function trackRefValue(ref: ComputedRefImpl<any>) {
	if (isTracking()) {
		let deps = computedRefs.get(ref);
		if (!deps) {
			deps = new Set();
			computedRefs.set(ref, deps);
		}
		trackEffects(deps);
	}
}

// 触发computed的依赖
function triggerRefValue(ref: ComputedRefImpl<any>) {
	const deps = computedRefs.get(ref);
	if (deps) {
		triggerEffects(deps);
	}
}

// 工具函数：判断是否为函数
function isFunction(value: any): value is (...args: any[]) => any {
	return typeof value === "function";
}
