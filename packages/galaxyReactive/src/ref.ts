import { track, trigger } from "./effect";
import { isObject } from "./reactive";
import { Ref } from "./types";

// 检查是否为ref
export function isRef<T>(r: Ref<T> | unknown): r is Ref<T>;
export function isRef(r: any): r is Ref {
	return !!(r && r.__v_isRef === true);
}

// 解包ref
export function unref<T>(ref: T | Ref<T>): T {
	return isRef(ref) ? (ref.value as any) : ref;
}

// 转换为ref
export function toRef<T extends object, K extends keyof T>(
	object: T,
	key: K,
	defaultValue?: T[K],
): Ref<T[K]> {
	const val = object[key];
	return isRef(val)
		? (val as Ref<T[K]>)
		: new ObjectRefImpl(object, key, defaultValue);
}

// 转换为多个ref
export function toRefs<T extends object>(
	object: T,
): { [K in keyof T]: Ref<T[K]> } {
	const ret: any = Array.isArray(object)
		? new Array((object as any[]).length)
		: {};
	for (const key in object) {
		ret[key] = toRef(object, key);
	}
	return ret;
}

// 对象ref实现
class ObjectRefImpl<T extends object, K extends keyof T> implements Ref<T[K]> {
	public readonly __v_isRef = true;

	constructor(
		private readonly _object: T,
		private readonly _key: K,
		private readonly _defaultValue?: T[K],
	) {}

	get value() {
		const val = this._object[this._key];
		return val === undefined ? (this._defaultValue as T[K]) : val;
	}

	set value(newVal) {
		this._object[this._key] = newVal;
	}

	get [Symbol.toStringTag]() {
		return "ObjectRef";
	}
}

// Ref实现类
class RefImpl<T> implements Ref<T> {
	public readonly __v_isRef = true;
	private _value: T;

	constructor(
		value: T,
		public readonly __v_isShallow: boolean,
	) {
		this._value = __v_isShallow ? value : toRaw(value);
	}

	get value() {
		track(this, "value");
		return this._value;
	}

	set value(newVal) {
		const useDirectValue = this.__v_isShallow || isObject(newVal);
		newVal = useDirectValue ? newVal : toRaw(newVal);
		if (hasChanged(this._value, newVal)) {
			this._value = newVal;
			trigger(this, "value");
		}
	}

	get [Symbol.toStringTag]() {
		return "Ref";
	}
}

// 检查值是否改变
function hasChanged(value: any, oldValue: any): boolean {
	return !Object.is(value, oldValue);
}

// 从reactive导入toRaw
function toRaw<T>(observed: T): T {
	const raw = observed && (observed as any).__v_raw;
	return raw ? toRaw(raw) : observed;
}

// 创建ref
export function ref<T>(value: T): Ref<T> {
	return createRef(value, false);
}

// 创建浅ref
export function shallowRef<T>(value: T): Ref<T> {
	return createRef(value, true);
}

// 创建ref的内部函数
function createRef<T>(value: T, shallow: boolean): Ref<T> {
	if (isRef(value)) {
		return value as Ref<T>;
	}
	return new RefImpl(value, shallow);
}

// 自定义ref
export function customRef<T>(factory: CustomRefFactory<T>): Ref<T> {
	return new CustomRefImpl(factory) as any;
}

// 自定义ref工厂函数类型
type CustomRefFactory<T> = (
	track: () => void,
	trigger: () => void,
) => {
	get: () => T;
	set: (value: T) => void;
};

// 自定义ref实现
class CustomRefImpl<T> implements Ref<T> {
	public readonly __v_isRef = true;

	private _dirty = true;
	private _value!: T;

	constructor(factory: CustomRefFactory<T>) {
		const { get, set } = factory(
			() => track(this, "value"),
			() => {
				this._dirty = true;
				trigger(this, "value");
			},
		);
		this._get = get;
		this._set = set;
	}

	private _get: () => T;
	private _set: (value: T) => void;

	get value() {
		if (this._dirty) {
			this._value = this._get();
			this._dirty = false;
		}
		track(this, "value");
		return this._value;
	}

	set value(newVal) {
		this._set(newVal);
	}

	get [Symbol.toStringTag]() {
		return "CustomRef";
	}
}
