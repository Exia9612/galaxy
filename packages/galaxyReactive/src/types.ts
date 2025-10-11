// 响应式数据类型
export interface ReactiveTarget {
	[key: string | symbol]: any;
}

// 依赖收集器
export interface Dep {
	addSub(sub: ReactiveEffect): void;
	removeSub(sub: ReactiveEffect): void;
	notify(): void;
}

// 副作用函数
export interface ReactiveEffect {
	(): any;
	deps: Dep[];
	active: boolean;
	scheduler?: (effect: ReactiveEffect) => void;
}

// 响应式对象标记
export const enum ReactiveFlags {
	IS_REACTIVE = "__v_isReactive",
	IS_READONLY = "__v_isReadonly",
	RAW = "__v_raw",
}

// 目标对象到代理对象的映射
export const reactiveMap = new WeakMap<ReactiveTarget, any>();
export const readonlyMap = new WeakMap<ReactiveTarget, any>();

// 当前活跃的副作用函数
export const activeEffect: ReactiveEffect | undefined = undefined;

// 依赖收集栈
export const effectStack: ReactiveEffect[] = [];

// 计算属性接口
export interface ComputedRef<T = any> {
	readonly value: T;
	readonly effect: ReactiveEffect;
}

// 监听器选项
export interface WatchOptions {
	immediate?: boolean;
	deep?: boolean;
	flush?: "pre" | "post" | "sync";
}

// 监听器函数
export type WatchCallback<V = any, OV = any> = (
	value: V,
	oldValue: OV,
	onInvalidate: (fn: () => void) => void,
) => any;

// Ref接口
export interface Ref<T = any> {
	value: T;
	[Symbol.toStringTag]: string;
}
