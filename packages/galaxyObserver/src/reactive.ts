import { createReactiveHandler, ReactiveFlags } from "./baseHandler";
import { isObject } from "./utils";

// reactive 功能
export function createReactive(target: object) {
	if (!isObject(target)) {
		console.warn(`value cannot be made reactive: ${String(target)}`);
		return;
	}

	return new Proxy(target, createReactiveHandler());
}

export function createReadonly(target: object) {
	if (!isObject(target)) {
		console.warn(`value cannot be made readonly: ${String(target)}`);
		return;
	}

	return new Proxy(target, createReactiveHandler(true));
}

export function createShadowReactive(target: object) {
	if (!isObject(target)) {
		console.warn(`value cannot be made shadow reactive: ${String(target)}`);
		return;
	}

	return new Proxy(target, createReactiveHandler(true, true));
}

export function isReactive(target: any) {
	return !!(target && target[ReactiveFlags.IS_REACTIVE]);
}

export function isReadonly(target: any) {
	return !!(target && target[ReactiveFlags.IS_READONLY]);
}

export function isShallow(target: any) {
	return !!(target && target[ReactiveFlags.IS_SHALLOW]);
}

export function isProxy(target: any) {
	return isReactive(target) || isReadonly(target);
}

export function reactive(target: any) {
	if (isReactive(target)) {
		return target;
	}

	return createReactive(target);
}

export function readonly(target: any) {
	if (isReadonly(target)) {
		return target;
	}

	return createReadonly(target);
}

export function shallowReactive(target: any) {
	if (isShallow(target)) {
		return target;
	}

	return createShadowReactive(target);
}
