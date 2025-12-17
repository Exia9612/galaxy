class Store<K extends string | number | symbol = string, T = any> {
	metricStore: Map<K, T>;

	constructor() {
		this.metricStore = new Map();
	}

	set(metric: K, value: T) {
		this.metricStore.set(metric, value);
	}

	get(metric: K) {
		return this.metricStore.get(metric);
	}

	getAll() {
		const result: Record<K, T> = {} as Record<K, T>;
		this.metricStore.forEach((value, key) => {
			result[key] = value;
		});
		return result as Record<K, T>;
	}

	remove(metric: K) {
		this.metricStore.delete(metric);
	}

	clear() {
		this.metricStore.clear();
	}

	has(metric: K) {
		return this.metricStore.has(metric);
	}
}

export default Store;
