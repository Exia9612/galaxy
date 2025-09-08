declare global {
	interface Window {
		__SENTINEL__: Record<string, any>;
	}
}

export {};
