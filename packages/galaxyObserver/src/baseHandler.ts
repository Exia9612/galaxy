import { track, trigger } from "./effect";
import { createReactive, createReadonly } from "./reactive";
import { isObject } from "./utils";

export const ReactiveFlags = {
	IS_REACTIVE: "__s_isReactive",
	IS_READONLY: "__s_isReadonly",
	IS_SHALLOW: "__s_isShallow",
	IS_RAW: "__s_raw",
};

export function createReactiveHandler(isReadonly = false, shallow = false) {
	// readonly 不可以更改属性，包括深层级的嵌套属性
	// shallow 只做第一层的响应式，不会递归转换嵌套对象
	return {
		get(target: object, key: string | symbol) {
			if (key === ReactiveFlags.IS_REACTIVE) {
				return !isReadonly;
			}
			if (key === ReactiveFlags.IS_READONLY) {
				return isReadonly;
			}
			if (key === ReactiveFlags.IS_SHALLOW) {
				return shallow;
			}
			if (key === ReactiveFlags.IS_RAW) {
				return target;
			}

			const res = Reflect.get(target, key);

			if (shallow) {
				return res;
			}

			if (isObject(res)) {
				return isReadonly ? createReadonly(res) : createReactive(res);
			}

			// 只读对象不会收集依赖
			if (!isReadonly) {
				track(target, key);
			}

			return res;
		},
		set(target: object, key: string | symbol, value: any) {
			if (isReadonly) {
				console.warn(
					`Set operation on key "${String(key)}" failed: target is readonly.`,
					target,
				);
				return true;
			}

			const oldValue = target[key];
			const hasKey = Object.prototype.hasOwnProperty.call(target, key);
			const result = Reflect.set(target, key, value);

			if (hasKey) {
				trigger(target, key, oldValue, value);
			} else {
				trigger(target, key, undefined, value);
			}

			return result;
		},
		deleteProperty(target: object, key: string | symbol) {
			if (isReadonly) {
				console.warn(
					`Delete operation on key "${String(key)}" failed: target is readonly.`,
					target,
				);
				return true;
			}

			const result = Reflect.deleteProperty(target, key);
			const hasKey = Object.prototype.hasOwnProperty.call(target, key);
			if (hasKey) {
				trigger(target, key, target[key], undefined);
			}

			return result;
		},
	};
}
