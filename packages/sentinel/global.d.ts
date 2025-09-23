declare global {
	interface Window {
		__SENTINEL__: Record<string, any>;
	}

	type TSFunc<T> = (...args: any[]) => T extends void ? void : T;
}

export {};
