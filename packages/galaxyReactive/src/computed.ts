import { ComputedRef, ReactiveEffect } from "./types";
import { createReactiveEffect, track, trigger } from "./effect";

// 计算属性实现类
class ComputedRefImpl<T> implements ComputedRef<T> {
	public readonly effect: ReactiveEffect;
	private _value!: T;
	private _dirty = true;

	constructor(
		getter: () => T,
		private readonly _setter: ((newValue: T) => void) | undefined,
	) {
		// 创建effect，使用调度器来标记脏值
		this.effect = createReactiveEffect(getter, () => {
			if (!this._dirty) {
				this._dirty = true;
				trigger(this, "value");
			}
		});
	}

	get value() {
		// 收集依赖
		track(this, "value");

		// 如果是脏值，重新计算
		if (this._dirty) {
			this._dirty = false;
			this._value = this.effect();
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

// 计算属性getter函数类型
type ComputedGetter<T> = () => T;

// 计算属性setter函数类型
type ComputedSetter<T> = (v: T) => void;

// 计算属性选项
interface ComputedOptions<T> {
	get: ComputedGetter<T>;
	set?: ComputedSetter<T>;
}

// 创建计算属性
export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>;
export function computed<T>(options: ComputedOptions<T>): ComputedRef<T>;
export function computed<T>(
	getterOrOptions: ComputedGetter<T> | ComputedOptions<T>,
): ComputedRef<T> {
	let getter: ComputedGetter<T>;
	let setter: ComputedSetter<T> | undefined;

	// 处理参数
	if (typeof getterOrOptions === "function") {
		getter = getterOrOptions;
	} else {
		getter = getterOrOptions.get;
		setter = getterOrOptions.set;
	}

	return new ComputedRefImpl(getter, setter);
}
