import { ReactiveEffect, Dep, effectStack } from "./types";

// 当前活跃的副作用函数
let activeEffect: ReactiveEffect | undefined = undefined;

// 创建依赖收集器
export class DepImpl implements Dep {
	private subs = new Set<ReactiveEffect>();

	addSub(sub: ReactiveEffect): void {
		this.subs.add(sub);
	}

	removeSub(sub: ReactiveEffect): void {
		this.subs.delete(sub);
	}

	notify(): void {
		// 创建副本避免在遍历时修改集合
		const effects = [...this.subs];
		for (const effect of effects) {
			if (effect.scheduler) {
				effect.scheduler(effect);
			} else {
				effect();
			}
		}
	}
}

// 创建副作用函数
export function createReactiveEffect<T = any>(
	fn: () => T,
	scheduler?: (effect: ReactiveEffect) => void,
): ReactiveEffect {
	const effect = function reactiveEffect(): T {
		if (!effect.active) {
			return fn();
		}

		// 避免重复收集依赖
		if (effectStack.includes(effect)) {
			return fn();
		}

		// 清理之前的依赖
		cleanup(effect);

		// 推入栈中并设置为当前活跃的effect
		effectStack.push(effect);
		activeEffect = effect;

		try {
			return fn();
		} finally {
			// 恢复之前的effect
			effectStack.pop();
			activeEffect = effectStack[effectStack.length - 1];
		}
	} as ReactiveEffect;

	effect.deps = [];
	effect.active = true;
	effect.scheduler = scheduler;

	return effect;
}

// 清理effect的依赖
function cleanup(effect: ReactiveEffect): void {
	const { deps } = effect;
	if (deps.length) {
		for (let i = 0; i < deps.length; i++) {
			deps[i].removeSub(effect);
		}
		deps.length = 0;
	}
}

// 收集依赖
export function track(target: object, key: string | symbol): void {
	if (!activeEffect) {
		return;
	}

	let depsMap = targetMap.get(target);
	if (!depsMap) {
		targetMap.set(target, (depsMap = new Map()));
	}

	let dep = depsMap.get(key);
	if (!dep) {
		depsMap.set(key, (dep = new DepImpl()));
	}

	trackEffects(dep);
}

// 收集依赖到具体的dep
export function trackEffects(dep: Dep): void {
	if (!activeEffect) {
		return;
	}

	dep.addSub(activeEffect);
	activeEffect.deps.push(dep);
}

// 触发更新
export function trigger(target: object, key: string | symbol): void {
	const depsMap = targetMap.get(target);
	if (!depsMap) {
		return;
	}

	const dep = depsMap.get(key);
	if (dep) {
		triggerEffects(dep);
	}
}

// 触发dep中的所有effect
export function triggerEffects(dep: Dep): void {
	dep.notify();
}

// 目标对象到依赖映射的映射
const targetMap = new WeakMap<object, Map<string | symbol, Dep>>();

// 停止effect
export function stop(effect: ReactiveEffect): void {
	if (effect.active) {
		cleanup(effect);
		effect.active = false;
	}
}
