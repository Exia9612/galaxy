declare global {
	type TSFunction<T> = (...args: any[]) => T;
}

export {};
