export interface EffectOptions {
	lazy?: boolean;
	scheduler?: (effect: ReactiveEffect) => void; // 调度函数，替代原本的run方法，可以让用户自定义响应式数据更新时的执行逻辑
	onTrack?: (event: any) => void;
	onTrigger?: (event: any) => void;
	onStop?: () => void;
}

export type Dep = Set<ReactiveEffect>;

let activeEffect: ReactiveEffect | undefined = undefined;
let shouldTrack = false; // 确保只会在effect(() => ...)中执行依赖收集
const targetMap = new WeakMap<object, Map<string | symbol, Dep>>();

export class ReactiveEffect {
	public deps: Set<Dep>; // 收集了该副作用的 dep 的集合
	public active: boolean;
	public options: EffectOptions;
	private _fn: (...args: any) => any;

	constuctor(fn: (...args: any) => any, options?: EffectOptions) {
		this._fn = fn;
		this.deps = new Set();
		this.options = options || {};
		this.active = true;
	}

	run() {
		if (!this.active) {
			// 不执行依赖收集
			return this._fn();
		}

		// 执行依赖收集
		shouldTrack = true;
		activeEffect = this as ReactiveEffect;
		const result = this._fn();
		shouldTrack = false;

		return result;
	}

	stop() {
		this.deps.forEach((deps) => {
			if (deps.has(this)) {
				deps.delete(this);
			}
		});
		if (this.options.onStop) {
			this.options.onStop();
		}
		this.active = false;
	}
}

export function track(target: object, key: string | symbol) {
	if (!activeEffect) {
		return;
	}

	let depsMap = targetMap.get(target);
	if (!depsMap) {
		depsMap = new Map();
		targetMap.set(target, depsMap);
	}

	let deps = depsMap.get(key);
	if (!deps) {
		deps = new Set<ReactiveEffect>();
		depsMap.set(key, deps);
	}

	// 副作用已经在依赖收集中了，不需要重复收集
	if (deps.has(activeEffect)) {
		return;
	}
	deps.add(activeEffect);
	activeEffect.deps.add(deps);
}

export function trigger(
	target: object,
	key: string | symbol,
	oldValue?: any,
	newValue?: any,
) {
	const depsMap = targetMap.get(target);
	if (!depsMap) {
		return;
	}

	const deps = depsMap.get(key);
	if (!deps) {
		return;
	}

	deps.forEach((effect) => {
		if (effect.options.scheduler) {
			effect.options.scheduler(effect);
		} else {
			effect.run();
		}
	});
}

export function trackEffects(deps: Dep) {
	if (!activeEffect) {
		return;
	}

	if (deps.has(activeEffect)) {
		return;
	}
	deps.add(activeEffect);
	activeEffect.deps.add(deps);
}
