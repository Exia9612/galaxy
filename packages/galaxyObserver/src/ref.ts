import { Dep, isTracking, trackEffects, triggerEffects } from "./effect";
import { createReactive } from "./reactive";
import { hasChanged, isObject } from "./utils";

export interface Ref<T = any> {
	value: T;
	_isRef: true;
}

function toReactive(value: any) {
	return isObject(value) ? createReactive(value) : value;
}

function trackRefValue(ref: RefImpl<any>) {
	if (isTracking()) {
		trackEffects(ref.dep);
	}
}

export function ref(value: any) {
	return new RefImpl(value, false);
}

export function isRef(ref: any) {
	return !!ref?._isRef;
}

export function unRef(ref: any) {
	// 如果参数是一个 ref，则返回内部值，否则返回参数本身
	return isRef(ref) ? ref.value : ref;
}

// 可以不通过ref.value的访问ref的值
export function proxyRefs(object: any) {
	return new Proxy(object, {
		get(target: any, key: string | symbol) {
			return unRef(Reflect.get(target, key));
		},
		set(target: any, key: string | symbol, value: any) {
			if (isRef(target[key]) && !isRef(value)) {
				return (target[key].value = value);
			} else {
				return Reflect.set(target, key, value);
			}
		},
	});
}

// ref function
class RefImpl<T> implements Ref<T> {
	private _value: T;
	private _rawValue: T;
	public dep: Dep;
	public readonly _isRef = true;
	public readonly _isShallow = false;

	constructor(value: T, isShallow: boolean) {
		this._rawValue = value;
		this._value = isShallow ? value : toReactive(value);
		this.dep = new Set();
	}

	get value() {
		trackRefValue(this);
		return this._value;
	}

	set value(newVal: T) {
		if (hasChanged(this._rawValue, newVal)) {
			this._rawValue = newVal;
			this._value = toReactive(newVal);
			triggerEffects(this.dep);
		}
	}
}
